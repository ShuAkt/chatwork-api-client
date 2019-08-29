const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const ejs = require("ejs");
const camelCase = require("camelcase");
const pascalCase = require("pascal-case");
const prettier = require("prettier");
const { json2ts } = require("json-ts");

const LANG = "ja";
const CHATWORK_URL = "https://api.chatwork.com/v2";

(function main() {
  const ramlStr = fs.readFileSync(
    path.join(__dirname, "api", "RAML", `api-${LANG}.raml`),
    { encoding: "utf8" }
  );

  const ramlData = yaml.safeLoad(prettier.format(ramlStr, { parser: "yaml" }));

  ramlData.traits = parseTraits(ramlData);

  const data = parseApi(ramlData);
  mapTraits(ramlData.traits, data);
  // console.log(data);

  const responseInterfaces = renderResponsesInterfaces(data);

  const paramInterfaces = renderParamInterfaces(data);

  const apiClass = renderApiClass(data, ramlData);

  const importData = `
import axios from 'axios';
`;

  const tsData =
    importData +
    apiClass +
    addExport(paramInterfaces) +
    addExport(responseInterfaces);

  const prettifiedTsData = prettier.format(tsData, {
    parser: "typescript"
  });

  // console.log(prettifiedTsData);

  fs.writeFileSync(path.join(__dirname, "src", "api.ts"), prettifiedTsData);
})();

function parseTraits(ramlData) {
  const { traits } = ramlData;
  return traits.reduce((pre, cur) => Object.assign(pre, cur), {});
}

function mapTraits(traits, data) {
  data
    .filter(data => !data.res && Array.isArray(data.is))
    .forEach(data => {
      data.is.forEach(is => {
        if (traits[is]["responses"]["200"]) {
          data.res =
            traits[is]["responses"]["200"]["body"]["application/json"][
              "example"
            ];
        }
      });
    });
}

function parseApi(ramlData, prefix = "") {
  return Object.keys(ramlData)
    .filter(key => key.match(/^\//))
    .map(uri => {
      const api = ramlData[uri];
      return [
        ...parseApi(api, prefix + uri),
        ...parseEndpoint(api, prefix + uri)
      ];
    })
    .reduce((pre, cur) => [...pre, ...cur], []);
}

function parseEndpoint(api, uri) {
  return Object.keys(api)
    .filter(method => method.match(/GET|POST|PUT|DELETE/))
    .map(method => parseMethod(method, api[method], uri));
}

function parseMethod(method, api, uri) {
  const { description, queryParameters, responses, is } = api;
  const ifName = getInterfaceName(method, uri);
  const funcName = camelCase(ifName);
  const funcParams = getFuncParams(uri);
  const funcParamsWithTypes = funcParams.map(
    param => param + ": number|string"
  );
  const funcParam = funcName + "Param";
  const funcParamWithTypes = funcParam + ": " + ifName + "Param";
  const params = getQueryParameters(queryParameters);

  const res = getResponses(responses);

  return {
    method,
    ifName,
    funcName,
    funcParams,
    funcParamsWithTypes,
    funcParam,
    funcParamWithTypes,
    api,
    uri,
    params,
    res,
    is,
    description: description
      ? description.replace(/^\|\s+/, "").replace(/\n/g, "")
      : ""
  };
}

function getInterfaceName(method, uri) {
  let uris = uri.split("/").filter(uri => uri);
  const isQueryLast = uris[uris.length - 1].match(/^{.*}$/);
  if (isQueryLast) uris.push("info");
  uris = uris.filter(uri => !uri.match(/^{.*}$/));

  return pascalCase([method, uris.join("_")].join("_"));
}

function getQueryParameters(queryParameters = {}) {
  const params = Object.keys(queryParameters).map(name => ({
    ...queryParameters[name],
    name
  }));

  params.forEach(param => {
    if (param.type === "integer") param.type = "number";
    if (param.type === "boolean") param.type = "0|1";
    if (param.enum) param.type = `'${param.enum.join(`'|'`)}'`;
    if (param.displayName) {
      param.displayName = param.displayName.replace(/\n/g, "");
    }
    if (!param.required) param.name += "?";
  });

  return params;
}

function getFuncParams(uri) {
  const funcParams = [];
  if (uri.includes("{room_id}")) funcParams.push("room_id");
  if (uri.includes("{message_id}")) funcParams.push("message_id");
  if (uri.includes("{task_id}")) funcParams.push("task_id");
  if (uri.includes("{file_id}")) funcParams.push("file_id");
  if (uri.includes("{request_id}")) funcParams.push("request_id");
  return funcParams;
}

function getResponses(responses = {}) {
  if (!responses["200"]) return;
  const example = responses["200"]["body"]["application/json"]["example"];
  return example ? example.replace(/^\|/, "") : undefined;
}

function renderParamInterfaces(data) {
  return ejs.render(
    `
<% data.forEach(d => { %>
/**
 * <%- d.description %>
 */
interface <%- d.ifName %>Param {
  <% d.params.forEach(param => { %>
  /** <%- param.displayName %> */
  <%- param.name %>: <%- param.type %>
  <% }); %>
}
<% }); %>
  `,
    { data: data.filter(d => d.params) }
  );
}

function renderResponsesInterfaces(data) {
  return data
    .filter(d => d.res)
    .map(d =>
      json2ts(d.res, {
        rootName: d.ifName + "Response",
        prefix: ""
      })
    )
    .join("\n");
}

function renderApiClass(data, ramlData) {
  return ejs.render(
    `
/**
 * <%- ramlData.title %> <%- ramlData.version %>
 */
export default class ChatworkApi {

  constructor(private api_token: string){}


  <% data.forEach(d => { %>
  <%
  let params = [...d.funcParamsWithTypes, d.funcParamWithTypes].join(', ');
  if(!d.params || d.params.length === 0) {
    params += ' = {}';
  }
  const url = '${CHATWORK_URL}' + d.uri.replace(/{/g, '\${');
  const method = d.method.toLowerCase();
  %>
  /**
   * <%- d.description %>
   */
  async <%- d.funcName %>(<%- params %>) {
    <% if(method === 'get' || method === 'delete') { %>
    const { data } = await axios.<%- method %>(\`<%- url %>\`, { params: <%- d.funcParam %>, headers: { 'X-ChatWorkToken': this.api_token }});
    <% } else if(method === 'post' || method === 'put') { %>
    const params = new URLSearchParams();
    Object.entries(<%- d.funcParam %>).forEach(([key, value]) => params.set(key, value));
    const { data } = await axios.<%- method %>(\`<%- url %>\`, params, { headers: { 'X-ChatWorkToken': this.api_token }});
    <% } %>
    return <%- d.res ? 'data as ' + d.ifName + 'Response' : 'data' %>;
  }
  <% }); %>
}
`,
    { data, ramlData }
  );
}

function addExport(tsData) {
  return tsData.replace(/interface/g, "export interface");
}
