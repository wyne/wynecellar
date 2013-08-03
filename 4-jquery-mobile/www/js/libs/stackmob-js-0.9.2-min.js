/*
 StackMob JS SDK Version 0.9.2 
 Copyright 2012-2013 StackMob Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function(){var j="undefined"!==typeof window?window:{location:{hostname:"api.stackmob.com",port:"443",protocol:"https:"}};j.StackMob=this.StackMob={DEFAULT_API_VERSION:0,DEFAULT_LOGIN_SCHEMA:"user",DEFAULT_LOGIN_FIELD:"username",DEFAULT_PASSWORD_FIELD:"password",EARTH_RADIANS_MI:3956.6,EARTH_RADIANS_KM:6367.5,FORCE_CREATE_REQUEST:"stackmob_force_create_request",ARRAY_FIELDNAME:"stackmob_array_fieldname",ARRAY_VALUES:"stackmob_array_values",CASCADE_DELETE:"stackmob_cascade_delete",HARD_DELETE:!0,
SOFT_DELETE:!1,API_SERVER:"api.stackmob.com",RETRY_WAIT:1E4,RETRY_ATTEMPTS:3,REFRESH_TOKEN_KEY:"oauth2.refreshToken",POST:"POST",PUT:"PUT",DELETE:"DELETE",CONTENT_TYPE_JSON:"application/json",SECURE_ALWAYS:"ALWAYS",SECURE_MIXED:"MIXED",SECURE_NEVER:"NEVER",apiVersion:0,sdkVersion:"0.9.2",publicKey:null,getProtocol:function(){return j.location.protocol},getHostname:function(){return j.location.hostname},getPort:function(){return j.location.port},Storage:{STORAGE_PREFIX:"stackmob.",persist:function(c,
e){localStorage&&localStorage.setItem(this.STORAGE_PREFIX+c,e)},retrieve:function(c){return localStorage?localStorage.getItem(this.STORAGE_PREFIX+c):null},remove:function(c){localStorage&&localStorage.removeItem(this.STORAGE_PREFIX+c)}},_generateCallbacks:function(c,e){c=c||{};c.success=function(c){e.isValidResult(c)?"function"===typeof e.yes&&e.yes(c):"function"===typeof e.no&&e.no(c)};!c.error&&"function"===typeof e.error&&(c.error=e.error);return c},_containsCallbacks:function(c,e){return"object"===
typeof c&&_.some(e,function(e){return"function"===typeof c[e]})},getLoggedInUser:function(c){var e=!this.isOAuth2Mode()&&this.Storage.retrieve(this.loggedInUserKey)||this.Storage.retrieve("oauth2.user");if(c&&c.success)this.hasValidOAuth(c);else return this.isLoggedIn(c)&&e?e:null},isLoggedIn:function(c){if(this._containsCallbacks(c,["yes","no"]))c=this._generateCallbacks(c,{isValidResult:function(c){return"undefined"!==typeof c},yes:c.yes,no:c.no,error:c.no}),this.hasValidOAuth(c);else return!this.isLoggedOut()||
this.hasValidOAuth(c)},isUserLoggedIn:function(c,e){if(this._containsCallbacks(e,["yes","no"]))e=this._generateCallbacks(e,{isValidResult:function(e){return e==c},yes:e.yes,no:e.no,error:e.no}),this.hasValidOAuth(e);else return c==this.getLoggedInUser(e)},isLoggedOut:function(c){if(this._containsCallbacks(c,["yes","no"]))c=this._generateCallbacks(c,{isValidResult:function(c){return"undefined"==typeof c},yes:c.yes,no:c.no,error:c.yes}),this.hasValidOAuth(c);else return!this.hasValidOAuth(c)},getBaseURL:function(){return StackMob.useRelativePathForAjax?
StackMob.apiDomain?StackMob.apiDomain:this.getHostname()+(this.getPort()?":"+this.getPort():"")+"/":StackMob.apiDomain?StackMob.apiDomain:StackMob.API_SERVER+"/"},throwError:function(c){throw Error(c);},urlError:function(){this.throwError('A "url" property or function must be specified')},requirePublicKey:function(){StackMob.publicKey||this.throwError("Error: This requires that you initialize StackMob with a public key.")},isOAuth2Mode:function(){return!isNaN(StackMob.publicKey&&!StackMob.privateKey)},
prepareCredsForSaving:function(c,e,f,a,b,d){a=(new Date).getTime()+1E3*this._stubbedExpireTime(a);c={"oauth2.accessToken":c,"oauth2.macKey":f,"oauth2.expires":a,"oauth2.user":b,"oauth2.userSchemaInfo":d};c[StackMob.REFRESH_TOKEN_KEY]=e;return c},_stubbedExpireTime:function(c){return c},saveOAuthCredentials:function(c){var e=c["oauth2.accessToken"],f=c[StackMob.REFRESH_TOKEN_KEY];this.Storage.retrieve("oauth2.accessToken")!=e&&this.Storage.persist("oauth2.expires",c["oauth2.expires"]);this.Storage.persist("oauth2.accessToken",
e);this.Storage.persist(StackMob.REFRESH_TOKEN_KEY,f);this.Storage.persist("oauth2.macKey",c["oauth2.macKey"]);this.Storage.persist("oauth2.user",c["oauth2.user"]);this.Storage.persist("oauth2.userSchemaInfo",JSON.stringify(c["oauth2.userSchemaInfo"]))},hasValidOAuth:function(c){c=c||{};if(!this.isOAuth2Mode())return c&&c.error&&c.error(),!1;var e=this.getOAuthCredentials();if(!_.all([e["oauth2.accessToken"],e["oauth2.macKey"],e&&e["oauth2.expires"]||0],_.identity))return c&&c.success&&c.success(void 0),
!1;if(StackMob.hasExpiredOAuth())if(c&&c.success){var f=c.success;c.success=function(a){var b=StackMob.getOAuthCredentials();f(a[b["oauth2.userSchemaInfo"]&&b["oauth2.userSchemaInfo"].loginField?b["oauth2.userSchemaInfo"].loginField:this.loginField])};this.initiateRefreshSessionCall(c)}else return!1;else return c&&c.success&&c.success(this.Storage.retrieve("oauth2.user")),this.Storage.retrieve("oauth2.user")},initiateRefreshSessionCall:function(c){StackMob.refreshSession.call(StackMob,c)},shouldSendRefreshToken:function(){return this.hasExpiredOAuth()&&
this.hasRefreshToken()&&this.shouldKeepLoggedIn()},keepLoggedIn:function(c){StackMob.Storage.persist("oauth2.shouldKeepLoggedIn",!0===c)},shouldKeepLoggedIn:function(){return"true"===StackMob.Storage.retrieve("oauth2.shouldKeepLoggedIn")},hasRefreshToken:function(){var c=this.getOAuthCredentials();return c&&"undefined"!==typeof c[StackMob.REFRESH_TOKEN_KEY]&&null!==c[StackMob.REFRESH_TOKEN_KEY]},getRefreshToken:function(){return this.getOAuthCredentials()[StackMob.REFRESH_TOKEN_KEY]},hasExpiredOAuth:function(){return this.isOAuth2Mode()&&
null===this.getOAuthExpireTime()||this.getOAuthExpireTime()<=(new Date).getTime()},clearOAuthCredentials:function(){StackMob.Storage.remove(StackMob.loggedInUserKey);StackMob.Storage.remove("oauth2.accessToken");StackMob.Storage.remove(StackMob.REFRESH_TOKEN_KEY);StackMob.Storage.remove("oauth2.macKey");StackMob.Storage.remove("oauth2.expires");StackMob.Storage.remove("oauth2.user");StackMob.Storage.remove("oauth2.userSchemaInfo")},getOAuthCredentials:function(){var c=StackMob.Storage.retrieve("oauth2.accessToken"),
e=StackMob.Storage.retrieve("oauth2.macKey"),f=StackMob.Storage.retrieve("oauth2.expires"),a=StackMob.Storage.retrieve(StackMob.REFRESH_TOKEN_KEY),b=StackMob.Storage.retrieve("oauth2.userSchemaInfo"),d=null;try{d=JSON.parse(b)}catch(g){}return _.every([c,e,f,a,d])?(c={"oauth2.accessToken":c,"oauth2.macKey":e,"oauth2.expires":f,"oauth2.userSchemaInfo":d},c[StackMob.REFRESH_TOKEN_KEY]=a,c):{}},getOAuthExpireTime:function(){var c=this.Storage.retrieve("oauth2.expires");return c?parseInt(c,10):null},
METHOD_MAP:{create:"POST",read:"GET",update:"PUT","delete":"DELETE",post:"POST",get:"GET",put:"PUT",addRelationship:"POST",appendAndSave:"PUT",deleteAndSave:"DELETE",login:"GET",accessToken:"POST",refreshToken:"POST",logout:"GET",forgotPassword:"POST",loginWithTempAndSetNewPassword:"GET",resetPassword:"POST",facebookAccessToken:"POST",facebookAccessTokenWithCreate:"POST",createUserWithFacebook:"POST",linkUserWithFacebook:"GET",unlinkUserFromFacebook:"DELETE",gigyaAccessToken:"POST",linkUserWithGigya:"POST",
unlinkUserFromGigya:"DELETE"},getProperty:function(c,e){return!c||!c[e]?null:_.isFunction(c[e])?c[e]():c[e]},init:function(c){c=c||{};this.initStart(c);this.userSchema=c.userSchema;this.loginField=c.loginField;this.passwordField=c.passwordField;this.newPasswordField="new_password";this.publicKey=c.publicKey;this.apiVersion=c.apiVersion||this.DEFAULT_API_VERSION;if("undefined"!==typeof c.apiURL)throw Error("Error: apiURL is no longer supported.  The API URL is now automatically set for PhoneGap users.");
var e=c.apiDomain;if("string"===typeof e){if(0===e.indexOf("http"))throw Error("Error: apiDomain should not specify url scheme (http/https). For example, specify api.stackmob.com instead of http://api.stackmob.com. URL Scheme is determined by the 'secure' init variable.");this.apiDomain=e.indexOf("/")==e.length-1?e:e+"/"}e=0<this.getHostname().indexOf(".stackmobapp.com");this.useRelativePathForAjax="boolean"===typeof c.useRelativePathForAjax?c.useRelativePathForAjax:e;this.secure=c.secure?c.secure:
0==this.getProtocol().indexOf("https:")?this.SECURE_ALWAYS:0==this.getProtocol().indexOf("http:")?this.SECURE_NEVER:this.SECURE_MIXED;this.ajax=c.ajax||this.ajax;this.initEnd(c);return this},initStart:function(){},initEnd:function(){},wrapStackMobCallbacks:function(){}}}).call(this);
(function(){function j(a){var b=a.url.match(/(^http|^https):\/\//g)+StackMob.getBaseURL(),d=a.url.replace(RegExp(b,"g"),"/"),g=b.replace(RegExp("^http://|^https://","g"),"").replace(/\//,""),c=StackMob.Storage.retrieve("oauth2.accessToken"),e=StackMob.Storage.retrieve("oauth2.macKey");StackMob.Storage.retrieve("oauth2.expires");if(StackMob.isOAuth2Mode()&&c&&e){var a=a.type,k=g.split(":"),g=1<k.length?k[0]:g,h=1<k.length?k[1]:"https"==b.substring(0,5)?443:80,b=Math.round((new Date).getTime()/1E3),
k="n"+Math.round(1E4*Math.random()),d=CryptoJS.HmacSHA1(b+"\n"+k+"\n"+a+"\n"+d+"\n"+g+"\n"+h+"\n\n",e).toString(CryptoJS.enc.Base64);return'MAC id="'+c+'",ts="'+b+'",nonce="'+k+'",mac="'+d+'"'}}function c(a,b){var b=b||{},d;if(!0===b.secureRequest)d="https";else switch(StackMob.secure){case StackMob.SECURE_ALWAYS:d="https";break;case StackMob.SECURE_NEVER:d="http";break;default:d=StackMob._isSecureMethod(a,b)?"https":"http"}return d+"://"}var e=this;_.extend(StackMob,{isSencha:function(){return e.Ext},
isZepto:function(){return e.Zepto},initEnd:function(){StackMob.Model=Backbone.Model.extend({urlRoot:StackMob.getBaseURL(),getBinaryFields:function(){return this.binaryFields||[]},url:function(){var a=StackMob.getBaseURL();return a+=this.schemaName},getPrimaryKeyField:function(){return this.schemaName+"_id"},constructor:function(){this.setIDAttribute();Backbone.Model.prototype.constructor.apply(this,arguments)},initialize:function(){StackMob.getProperty(this,"schemaName")||StackMob.throwError("A schemaName must be defined");
this.setIDAttribute()},setIDAttribute:function(){this.idAttribute=this.getPrimaryKeyField()},parse:function(a){return!a||a&&(!a.text||""===a.text)?a:JSON.parse(a.text)},sync:function(a,b,d){StackMob.sync.call(this,a,this,d)},create:function(a){var b={};b[StackMob.FORCE_CREATE_REQUEST]=!0;_.extend(b,a);this.save(null,b)},query:function(a,b){b=b||{};_.extend(b,{query:a});this.fetch(b)},fetch:function(a){StackMob.wrapStackMobCallbacks.call(this,a);Backbone.Model.prototype.fetch.call(this,a)},destroy:function(a){StackMob.wrapStackMobCallbacks.call(this,
a);Backbone.Model.prototype.destroy.call(this,a)},save:function(a,b){var d=a?a.success:{},g=a?a.error:{};"undefined"===typeof b&&(_.isFunction(d)||_.isFunction(g))?(StackMob.wrapStackMobCallbacks.call(this,a),Backbone.Model.prototype.save.call(this,null,a)):(StackMob.wrapStackMobCallbacks.call(this,b),Backbone.Model.prototype.save.call(this,a,b))},fetchExpanded:function(a,b){(0>a||3<a)&&StackMob.throwError("Depth must be between 0 and 3 inclusive.");var d={};_.extend(d,b);d.data=d.data||{};d.data._expand=
a;this.fetch(d)},getAsModel:function(a,b){var d=this.get(a);return d?_.isArray(d)?_.map(d,function(a){return new b(a)}):new b(d):{}},appendAndCreate:function(a,b,d){this.addRelationship(a,b,d)},addRelationship:function(a,b,d){d=d||{};d[StackMob.ARRAY_FIELDNAME]=a;d[StackMob.ARRAY_VALUES]=b;StackMob.sync.call(this,"addRelationship",this,d)},appendAndSave:function(a,b,d){d=d||{};d[StackMob.ARRAY_FIELDNAME]=a;d[StackMob.ARRAY_VALUES]=b;StackMob.sync.call(this,"appendAndSave",this,d)},deleteAndSave:function(a,
b,d,g){g=g||{};g[StackMob.ARRAY_FIELDNAME]=a;g[StackMob.ARRAY_VALUES]=b;g[StackMob.CASCADE_DELETE]=d;var c=this;g.stackmob_ondeleteAndSave=function(){var d=c.get(a);c.set(a,_.difference(d,b))};StackMob.sync.call(this,"deleteAndSave",this,g)},setBinaryFile:function(a,b,d,g){this.set(a,"Content-Type: "+d+"\nContent-Disposition: attachment; filename="+b+"\nContent-Transfer-Encoding: base64\n\n"+g)},incrementOnSave:function(a,b){this.attributes[this.idAttribute]?(this.attributes[a]&&delete this.attributes[a],
this.set(a+"[inc]",b)):StackMob.throwError("Please specify an id for the row you wish to update. When creating a new instance of your object, you need to pass in JSON that includes the id field and value (e.g. var user = new StackMob.User({ username: 'chucknorris' });)  Or, for custom objects: var todoInstance = new Todo({todo_id : '1234'})")},decrementOnSave:function(a,b){this.incrementOnSave(a,-1*b)}});StackMob.Collection=Backbone.Collection.extend({initialize:function(){this.model||StackMob.throwError("Please specify a StackMob.Model for this collection. e.g., var Items = StackMob.Collection.extend({ model: Item });");
this.schemaName=(new this.model).schemaName},url:function(){var a=StackMob.getBaseURL();return a+=this.schemaName},parse:function(a){return!a||a&&(!a.text||""===a.text)?a:JSON.parse(a.text)},sync:function(a,b,d){StackMob.sync.call(this,a,this,d)},query:function(a,b){b=b||{};_.extend(b,{query:a});this.fetch(b)},destroyAll:function(a,b){var b=b||{},d=this,g=b.success;b.success=function(a){d.remove(d.models);"function"==typeof g&&g(a)};_.extend(b,{query:a});return(this.sync||Backbone.sync).call(this,
"delete",this,b)},create:function(a,b){var d={};d[StackMob.FORCE_CREATE_REQUEST]=!0;_.extend(d,b);StackMob.wrapStackMobCallbacks.call(this,d);Backbone.Collection.prototype.create.call(this,a,d)},fetch:function(a){StackMob.wrapStackMobCallbacks.call(this,a);Backbone.Collection.prototype.fetch.call(this,a)},createAll:function(a){a=a||{};return(this.sync||Backbone.sync).call(this,"create",this,a)},count:function(a,b){a=a.clone()||new StackMob.Collection.Query;b=b||{};b.stackmob_count=!0;var d=b.success;
b.success=function(a){if((_xhr=a)&&a.getAllResponseHeaders){var b=a.getResponseHeader("Content-Range"),c=0;b&&(c=b.substring(b.indexOf("/")+1,b.length));if(0===c)try{c=JSON.parse(a.responseText).length}catch(e){}d&&d(c)}else d(a)};a.setRange&&(b.query=a.setRange(0,0));return(this.sync||Backbone.sync).call(this,"query",this,b)}});f()},cc:function(a,b,d,c){this.customcode(a,b,d,c)},customcode:function(a,b,d,g){if(_.isObject(d)){var g=d||{},e=g.httpVerb;g.httpVerb=e&&!_.isUndefined(StackMob.METHOD_MAP[d.toLowerCase()])?
e:"GET"}else g=g||{},_.isString(d)&&(d&&!_.isUndefined(StackMob.METHOD_MAP[d.toLowerCase()]))&&(g.httpVerb=d.toUpperCase());g.data=g.data||{};"GET"!==d&&(g.contentType=g.contentType||StackMob.CONTENT_TYPE_JSON);_.extend(g.data,b);g.url=c(a,b)+this.getBaseURL();this.sync.call(StackMob,a,null,g)},processLogin:function(a,b){if(StackMob.isOAuth2Mode()){var d=a.access_token,c=a.refresh_token,e=a.mac_key,l=a.expires_in;try{var k=StackMob.getOAuthCredentials(),h=b.stackmob_userschemainfo||k["oauth2.userSchemaInfo"],
f=a.stackmob.user[h.loginField],i=StackMob.prepareCredsForSaving(d,c,e,l,f,h);StackMob.saveOAuthCredentials(i);StackMob.Storage.persist(StackMob.loggedInUserKey,f)}catch(n){console&&console.error("Problem saving OAuth 2.0 credentials and user: "+n)}}},sync:function(a,b,d){d=d||{};if(!StackMob.isAccessTokenMethod(a)&&StackMob.shouldSendRefreshToken()&&!0!==d.stackmob_attempted_refresh){var g=a,e=d;e.stackmob_attempted_refresh=!0;var l=this;StackMob.refreshSession.call(StackMob,{oncomplete:function(){StackMob.sync.call(l,
g,b,e)}});return!1}var f=!0===d[StackMob.FORCE_CREATE_REQUEST];f&&(a="create");var h=_.extend({type:d.httpVerb||StackMob.METHOD_MAP[a]||"GET"},d);h.data=h.data||{};var m=a,i;i=h||{};var n=c(m,i);!i.url&&b&&(i.url=n+b.url());var n="cc"!=m,q=b&&b.isNew&&!b.isNew(),f=!f,s="addRelationship"==m||"appendAndSave"==m||"deleteAndSave"==m;if(_.include("create update delete read query deleteAndSave appendAndSave addRelationship".split(" "),m)){if(s||n&&q&&f)i.url+=("/"==i.url.charAt(i.url.length-1)?"":"/")+
encodeURIComponent(b.get(b.getPrimaryKeyField())),s&&(i.url+="/"+d[StackMob.ARRAY_FIELDNAME]),"deleteAndSave"==m&&(m="",m=_.isArray(d[StackMob.ARRAY_VALUES])?_.map(d[StackMob.ARRAY_VALUES],function(a){return encodeURIComponent(a)}).join(","):encodeURIComponent(d[StackMob.ARRAY_VALUES]),i.url+="/"+m)}else i.url+=("/"==i.url.charAt(i.url.length-1)?"":"/")+m;i=a;m=d||{};h.headers=h.headers||{};h.headers=_.extend(h.headers,{Accept:"application/vnd.stackmob+json; version="+StackMob.apiVersion});_.extend(h.headers,
{"X-StackMob-User-Agent":"StackMob (JS; "+StackMob.sdkVersion+")"});StackMob.publicKey&&!StackMob.privateKey?(h.headers["X-StackMob-API-Key"]=StackMob.publicKey,h.headers["X-StackMob-Proxy-Plain"]="stackmob-api",h.headers["X-StackMob-API-Key-"+StackMob.publicKey]="1"):h.headers["X-StackMob-Proxy"]="stackmob-api";StackMob.isOAuth2Mode()&&StackMob.isAccessTokenMethod(i)?h.contentType="application/x-www-form-urlencoded":_.include(["PUT","POST"],StackMob.METHOD_MAP[i])&&(h.contentType=h.contentType||
StackMob.CONTENT_TYPE_JSON);isNaN(m[StackMob.CASCADE_DELETE])||(h.headers["X-StackMob-CascadeDelete"]=!0===m[StackMob.CASCADE_DELETE]);if(m.query&&(i=h.query||throwError("No StackMobQuery object provided to the query call."),i.selectFields&&0<i.selectFields.length&&(h.headers["X-StackMob-Select"]=i.selectFields.join()),i.range&&(h.headers.Range="objects="+i.range.start+"-"+i.range.end),_.extend(h.data,i.params),i.orderBy&&0<i.orderBy.length)){i=i.orderBy;m="";n=i.length;for(q=0;q<n;q++)m+=i[q],q+
1<n&&(m+=",");h.headers["X-StackMob-OrderBy"]=m}i=a;n=function(a){return _.map(_.keys(a),function(b){return b+"="+encodeURIComponent(a[b])}).join("&")};m=d||{};if(StackMob.isOAuth2Mode()&&StackMob.isAccessTokenMethod(i))h.data=n(h.data);else if("POST"==h.type||"PUT"==h.type)if("resetPassword"==i||"forgotPassword"==i)h.data=JSON.stringify(h.data);else if("addRelationship"==i||"appendAndSave"==i)m&&m[StackMob.ARRAY_VALUES]&&(h.data=JSON.stringify(m[StackMob.ARRAY_VALUES]));else if(b){var p=b.toJSON();
_.each(m.remote_ignore||[],function(a){delete p[a]});delete p.lastmoddate;delete p.createddate;"update"==i&&((i=m.stackmob_userschemainfo||StackMob.getOAuthCredentials()["oauth2.userSchemaInfo"])&&delete p[i.passwordField],_.each(b.getBinaryFields(),function(a){p[a]&&0===p[a].indexOf("http")&&delete p[a]}));StackMob.isOAuth2Mode()&&delete p.sm_owner;h.data=JSON.stringify(_.extend(p,h.data))}else h.data=JSON.stringify(h.data);else{if(("GET"==h.type||"DELETE"==h.type)&&!_.isEmpty(h.data))h.url+="?",
i=n(h.data),h.url+=i;delete h.data}i=h||{};i.processData=!1;i.accepts=i.headers.Accept;StackMob.isAccessTokenMethod(a)||(i=j(h))&&(h.headers.Authorization=i);StackMob.makeAPICall(b,h,a,d)},refreshSession:function(a){var b={};_.extend(b,a);if(StackMob.hasRefreshToken()){var d=StackMob.getOAuthCredentials()["oauth2.userSchemaInfo"]?StackMob.getOAuthCredentials()["oauth2.userSchemaInfo"].schemaName:StackMob.userSchema;b.url=c("refreshToken")+this.getBaseURL()+d;b.contentType="application/x-www-form-urlencoded";
b.data={refresh_token:StackMob.getOAuthCredentials()[StackMob.REFRESH_TOKEN_KEY],grant_type:"refresh_token",token_type:"mac",mac_algorithm:"hmac-sha1"};var g=a.oncomplete;g&&(b.oncomplete=function(){g()});a&&a.success&&(b.success=a.success);b.stackmob_onrefreshToken=StackMob.processLogin;b.error=function(){a&&a.error&&a.error();StackMob.Storage.remove(StackMob.REFRESH_TOKEN_KEY)};(this.sync||Backbone.sync).call(this,"refreshToken",this,b)}else a&&a.error&&a.error()},makeAPICall:function(a,b,d,c){return StackMob.ajax?
StackMob.ajax(a,b,d,c):StackMob.isSencha()?StackMob.ajaxOptions.sencha(a,b,d,c):StackMob.isZepto()?StackMob.ajaxOptions.zepto(a,b,d,c):StackMob.ajaxOptions.jquery(a,b,d,c)},onsuccess:function(a,b,d,c,e,f){if(d){if(_.isFunction(d["stackmob_on"+b]))d["stackmob_on"+b](c,f);if(_.isFunction(d.oncomplete))d.oncomplete(c)}if(e)if(c)if(StackMob.isOAuth2Mode()&&StackMob.isAccessTokenMethod(b)&&c.stackmob){c=c.stackmob.user;b=!0===f.fullyPopulateUser;if(a&&a.parse)if(b){if(!a.set(a.parse(c,f),f))return!1}else if(d=
{},d[a.getPrimaryKeyField()]=c[a.getPrimaryKeyField()],!a.set(d,f))return!1;e(c);b&&(a&&a.trigger)&&a.trigger("sync",a,c,f)}else e(c);else e()},onerror:function(a,b,d,c,e,f){var c=a.status,k;try{k=JSON.parse(b)}catch(h){k={error:"Invalid JSON returned."}}if(503==c){a=a.getResponseHeader("retry-after");try{a=1E3*parseInt(responseHeaderValue,10)}catch(m){a=StackMob.RETRY_WAIT}if("number"===typeof e.stackmob_retry){if(e.stackmob_retry-=1,0>=e.stackmob_retry)return}else e.stackmob_retry=StackMob.RETRY_ATTEMPTS;
_.delay(function(){var a=j(e);e.headers.Authorization=a;d&&d(e)},a)}else{if(_.isFunction(e.oncomplete))e.oncomplete(k);f&&f(k)}},isAccessTokenMethod:function(a){return _.include(["accessToken","refreshToken","facebookAccessToken","facebookAccessTokenWithCreate","gigyaAccessToken"],a)},_isSecureMethod:function(a,b){var d="loginWithTempAndSetNewPassword createUserWithFacebook linkUserWithFacebook unlinkUserFromFacebook linkUserWithGigya unlinkUserFromGigya".split(" ");return StackMob.isAccessTokenMethod(a)?
!0:!0===b.isUserCreate?!0:_.include(d,a)}});var f=function(){StackMob.User=StackMob.Model.extend({schemaName:StackMob.userSchema||StackMob.DEFAULT_LOGIN_SCHEMA,loginField:StackMob.loginField||StackMob.DEFAULT_LOGIN_FIELD,passwordField:StackMob.passwordField||StackMob.DEFAULT_PASSWORD_FIELD,idAttribute:this.loginField,getPrimaryKeyField:function(){return this.loginField},create:function(a){a=a||{};a.isUserCreate=!0;StackMob.Model.prototype.create.call(this,a)},isLoggedIn:function(a){a=a||{};if(StackMob._containsCallbacks(a,
["yes","no"]))a=StackMob._generateCallbacks(a,{isValidResult:function(a){return"undefined"!==typeof a},yes:a.yes,no:a.no,error:a.no}),StackMob.hasValidOAuth(a);else return StackMob.isUserLoggedIn(this.get(this.loginField),a)},login:function(a,b){b=b||{};StackMob.keepLoggedIn("undefined"===typeof a?!1:a);b.data=b.data||{};b.data[this.loginField]=this.get(this.loginField);b.data[this.passwordField]=this.get(this.passwordField);StackMob.isOAuth2Mode()&&(b.data.token_type="mac");b.stackmob_onaccessToken=
StackMob.processLogin;(this.sync||Backbone.sync).call(this,StackMob.isOAuth2Mode()?"accessToken":"login",this,b)},logout:function(a){a=a||{};a.data=a.data||{};(this.sync||Backbone.sync).call(this,"logout",this,a);StackMob.clearOAuthCredentials()},loginWithGigya:function(a,b,d,c,e){e=e||{};StackMob.keepLoggedIn("undefined"===typeof c?!1:c);e.data=e.data||{};_.extend(e.data,{gigya_uid:a,gigya_ts:b,gigya_sig:d,token_type:"mac"});e.stackmob_ongigyaAccessToken=StackMob.processLogin;(this.sync||Backbone.sync).call(this,
"gigyaAccessToken",this,e)},linkUserWithGigya:function(a,b,d,c){c=c||{};c.data=c.data||{};_.extend(c.data,{gigya_uid:a,gigya_ts:b,gigya_sig:d,token_type:"mac"});(this.sync||Backbone.sync).call(this,"linkUserWithGigya",this,c)},unlinkUserFromGigya:function(a){(this.sync||Backbone.sync).call(this,"unlinkUserFromGigya",this,a)},loginWithFacebook:function(a,b,d){this.loginWithFacebookToken(a,b,d)},loginWithFacebookToken:function(a,b,d){d=d||{};StackMob.keepLoggedIn("undefined"===typeof b?!1:b);d.data=
d.data||{};_.extend(d.data,{fb_at:a,token_type:"mac"});!0===d.createIfNeeded?(d.stackmob_onfacebookAccessTokenWithCreate=StackMob.processLogin,d.data[this.loginField]=d[this.loginField]||this.get(this.loginField),(this.sync||Backbone.sync).call(this,"facebookAccessTokenWithCreate",this,d)):(d.stackmob_onfacebookAccessToken=StackMob.processLogin,(this.sync||Backbone.sync).call(this,"facebookAccessToken",this,d))},loginWithFacebookAutoCreate:function(a,b,d){d=d||{};d.createIfNeeded=!0;this.loginWithFacebookToken(a,
b,d)},createUserWithFacebook:function(a,b){b=b||{};b.data=b.data||{};_.extend(b.data,{fb_at:a,token_type:"mac"});b.data[this.loginField]=b[this.loginField]||this.get(this.loginField);(this.sync||Backbone.sync).call(this,"createUserWithFacebook",this,b)},linkUserWithFacebook:function(a,b){b=b||{};b.data=b.data||{};_.extend(b.data,{fb_at:a,token_type:"mac"});(this.sync||Backbone.sync).call(this,"linkUserWithFacebook",this,b)},unlinkUserFromFacebook:function(a){(this.sync||Backbone.sync).call(this,"unlinkUserFromFacebook",
this,a)},loginWithTempAndSetNewPassword:function(a,b,d,c){c=c||{};c.data=c.data||{};this.set(this.passwordField,a);c.data[StackMob.newPasswordField]=b;this.login(d,c)},forgotPassword:function(a){a=a||{};a.data=a.data||{};a.data[this.loginField]=this.get(this.loginField);(this.sync||Backbone.sync).call(this,"forgotPassword",this,a)},resetPassword:function(a,b,d){d=d||{};d.data=d.data||{};d.data.old={password:a};d.data["new"]={password:b};(this.sync||Backbone.sync).call(this,"resetPassword",this,d)},
sync:function(a,b,d){d=d||{};d.stackmob_userschemainfo={schemaName:this.schemaName,loginField:this.loginField,passwordField:this.passwordField};StackMob.Model.prototype.sync.call(this,a,b,d)}});StackMob.Users=StackMob.Collection.extend({model:StackMob.User});StackMob.GeoPoint=function(a,b){_.isNumber(a)?((-90>a||90<a)&&StackMob.throwError("Latitude value must be between -90 and 90 inclusive."),(-180>b||180<b)&&StackMob.throwError("Longitude value must be between -180 and 180 inclusive."),this.lat=
a,this.lon=b):((-90>a.lat||90<a.lat)&&StackMob.throwError("Latitude value must be between -90 and 90 inclusive."),(-180>a.lon||180<a.lon)&&StackMob.throwError("Longitude value must be between -180 and 180 inclusive."),this.lat=a.lat,this.lon=a.lon)};StackMob.GeoPoint.prototype.toJSON=function(){return{lat:this.lat,lon:this.lon}};StackMob.Model.Query=function(){this.selectFields=[];this.params={}};_.extend(StackMob.Model.Query.prototype,{select:function(a){this.selectFields.push(a);return this},setExpand:function(a){this.params._expand=
a;return this}});StackMob.Collection.Query=function(){this.params={};this.selectFields=[];this.orderBy=[];this.range=null};StackMob.Collection.Query.prototype=new StackMob.Model.Query;StackMob.Collection.Query.prototype.constructor=StackMob.Collection.Query();_.extend(StackMob.Collection.Query.prototype,{or:function(a){if("undefined"==typeof this.orId){var b=this.clone();b.params={};b.orId=1;b.andCount=1;var d,c;c=_.keys(this.params);d="";1<c.length&&(d=b.andCount++,d="[and"+d+"].");for(var e in this.params)c=
"[or"+b.orId+"]."+d+e,b.params[c]=this.params[e]}else b=this.clone();c=_.keys(a.params);d="";1<c.length&&(d=b.andCount++,d="[and"+d+"].");for(e in a.params){c="[or"+b.orId+"]."+d+e;if("undefined"!==typeof b.params[c])throw Error("Error: You are attempting to OR two or more values for the same field. You should use an mustBeOneOf method instead.");b.params[c]=a.params[e]}return b},and:function(a){var b=this.clone(),d;for(d in a.params)b.params[d]=a.params[d];return b},clone:function(){var a=_.clone(this);
a.params=_.clone(this.params);return a},addParam:function(a,b){this.params[a]=b;return this},equals:function(a,b){""===b?this.params[a+"[empty]"]=!0:this.params[a]=b;return this},lt:function(a,b){this.params[a+"[lt]"]=b;return this},lte:function(a,b){this.params[a+"[lte]"]=b;return this},gt:function(a,b){this.params[a+"[gt]"]=b;return this},gte:function(a,b){this.params[a+"[gte]"]=b;return this},notEquals:function(a,b){""===b?this.params[a+"[empty]"]=!1:this.params[a+"[ne]"]=b;return this},isNull:function(a){this.params[a+
"[null]"]=!0;return this},isNotNull:function(a){this.params[a+"[null]"]=!1;return this},mustBeOneOf:function(a,b){var d="";if(_.isArray(b))for(var c=b.length,e=0;e<c;e++)d+=b[e],e+1<c&&(d+=",");else d=b;this.params[a+"[in]"]=d;return this},orderAsc:function(a){this.orderBy.push(a+":asc");return this},orderDesc:function(a){this.orderBy.push(a+":desc");return this},setRange:function(a,b){this.range={start:a,end:b};return this},mustBeNear:function(a,b,d){this.params[a+"[near]"]=b.lat+","+b.lon+","+d;
return this},mustBeNearMi:function(a,b,d){this.mustBeNear(a,b,d/StackMob.EARTH_RADIANS_MI);return this},mustBeNearKm:function(a,b,d){this.mustBeNear(a,b,d/StackMob.EARTH_RADIANS_KM);return this},isWithin:function(a,b,d){this.params[a+"[within]"]=b.lat+","+b.lon+","+d;return this},isWithinMi:function(a,b,d){this.isWithin(a,b,d/StackMob.EARTH_RADIANS_MI);return this},isWithinKm:function(a,b,d){this.isWithin(a,b,d/StackMob.EARTH_RADIANS_KM);return this},isWithinBox:function(a,b,d){this.params[a+"[within]"]=
b.lat+","+b.lon+","+d.lat+","+d.lon;return this}})}}).call(this);
(function(){var j=this.jQuery||this.Ext||this.Zepto;_.extend(StackMob,{ajaxOptions:{sencha:function(c,e,f,a){var b={},d=e.success;e.success=function(b){var g=null;if(b&&b.responseText)try{g=JSON.parse(b.responseText)}catch(k){g=b.responseText}!0===e.stackmob_count&&(g=b);StackMob.onsuccess(c,f,e,g,d,a)};var g=e.error;b.url=e.url;b.headers=e.headers;b.params=e.data;b.success=e.success;b.disableCaching=!1;b.method=e.type;e.error=function(a,d){StackMob.onerror(a,a.responseText||a.text,j.Ajax.request,
c,b,g,d)};b.failure=e.error;return j.Ajax.request(b)},zepto:function(c,e,f,a){var b=e.success,d=function(d,g){g=d;try{g=JSON.parse(d)}catch(l){}StackMob.onsuccess(c,f,e,g,b,a)};e.success=d;var g=e.error,r=function(b){StackMob.onerror(b,b.responseText||b.text,j.ajax,c,e,g,a)};e.error=r;var l={};l.url=e.url;l.headers=e.headers;l.contentType=e.headers.contentType;l.type=e.type;l.data=e.data;l.success=d;l.error=r;return j.ajax(l)},jquery:function(c,e,f,a){e.converters={"text json":function(a){return"string"!=
typeof a||!j.trim(a).length?{}:jQuery.parseJSON(a)}};e.beforeSend=function(a,b){a.setRequestHeader("Accept",b.accepts);if(!_.isEmpty(b.headers))for(var d in b.headers)a.setRequestHeader(d,b.headers[d])};var b=e.error;e.error=function(d,f,l){if(0===d.status&&e.query&&"object"===typeof e.query.range)this.success(d,f,l);else StackMob.onerror(d,d.responseText||d.text,j.ajax,c,e,b,a)};var d=e.success;e.success=function(b,j,l){var k;if(!0===e.stackmob_count)k=l;else if(b&&b.toJSON)k=b;else if(b&&(b.responseText||
b.text))try{k=JSON.parse(b.responseText||b.text)}catch(h){k=b.responseText||b.text}else b&&(k=b);StackMob.onsuccess(c,f,e,k,d,a)};return j.ajax(e)}}})}).call(this);
var CryptoJS=CryptoJS||function(j,c){var e={},f=e.lib={},a=function(){},b=f.Base={extend:function(b){a.prototype=this;var d=new a;b&&d.mixIn(b);d.$super=this;return d},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}},d=f.WordArray=b.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=
b!=c?b:4*a.length},toString:function(a){return(a||r).stringify(this)},concat:function(a){var b=this.words,d=a.words,c=this.sigBytes,a=a.sigBytes;this.clamp();if(c%4)for(var e=0;e<a;e++)b[c+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((c+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)b[c+e>>>2]=d[e>>>2];else b.push.apply(b,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=j.ceil(b/4)},clone:function(){var a=b.clone.call(this);
a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*j.random()|0);return d.create(b,a)}}),g=e.enc={},r=g.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,d=[],c=0;c<a;c++){var e=b[c>>>2]>>>24-8*(c%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var b=a.length,c=[],e=0;e<b;e+=2)c[e>>>3]|=parseInt(a.substr(e,2),16)<<24-4*(e%8);return d.create(c,b/2)}},l=g.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,d=[],c=0;c<a;c++)d.push(String.fromCharCode(b[c>>>2]>>>24-8*(c%4)&255));return d.join("")},parse:function(a){for(var b=a.length,c=[],e=0;e<b;e++)c[e>>>2]|=(a.charCodeAt(e)&255)<<24-8*(e%4);return d.create(c,b)}},k=g.Utf8={stringify:function(a){try{return decodeURIComponent(escape(l.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return l.parse(unescape(encodeURIComponent(a)))}},h=f.BufferedBlockAlgorithm=b.extend({reset:function(){this._data=d.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,e=b.sigBytes,g=this.blockSize,f=e/(4*g),f=a?j.ceil(f):j.max((f|0)-this._minBufferSize,0),a=f*g,e=j.min(4*a,e);if(a){for(var h=0;h<a;h+=g)this._doProcessBlock(c,h);h=c.splice(0,a);b.sigBytes-=e}return d.create(h,e)},clone:function(){var a=b.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});f.Hasher=h.extend({init:function(){this.reset()},
reset:function(){h.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=h.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,d){return a.create(d).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return m.HMAC.create(a,d).finalize(b)}}});var m=e.algo={};return e}(Math);
(function(){var j=CryptoJS,c=j.lib,e=c.WordArray,c=c.Hasher,f=[],a=j.algo.SHA1=c.extend({_doReset:function(){this._hash=e.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(a,d){for(var c=this._hash.words,e=c[0],l=c[1],k=c[2],h=c[3],j=c[4],i=0;80>i;i++){if(16>i)f[i]=a[d+i]|0;else{var n=f[i-3]^f[i-8]^f[i-14]^f[i-16];f[i]=n<<1|n>>>31}n=(e<<5|e>>>27)+j+f[i];n=20>i?n+((l&k|~l&h)+1518500249):40>i?n+((l^k^h)+1859775393):60>i?n+((l&k|l&h|k&h)-1894007588):n+((l^k^h)-
899497514);j=h;h=k;k=l<<30|l>>>2;l=e;e=n}c[0]=c[0]+e|0;c[1]=c[1]+l|0;c[2]=c[2]+k|0;c[3]=c[3]+h|0;c[4]=c[4]+j|0},_doFinalize:function(){var a=this._data,d=a.words,c=8*this._nDataBytes,e=8*a.sigBytes;d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+15]=c;a.sigBytes=4*d.length;this._process()}});j.SHA1=c._createHelper(a);j.HmacSHA1=c._createHmacHelper(a)})();
(function(){var j=CryptoJS,c=j.enc.Utf8;j.algo.HMAC=j.lib.Base.extend({init:function(e,f){e=this._hasher=e.create();"string"==typeof f&&(f=c.parse(f));var a=e.blockSize,b=4*a;f.sigBytes>b&&(f=e.finalize(f));for(var d=this._oKey=f.clone(),g=this._iKey=f.clone(),j=d.words,l=g.words,k=0;k<a;k++)j[k]^=1549556828,l[k]^=909522486;d.sigBytes=g.sigBytes=b;this.reset()},reset:function(){var c=this._hasher;c.reset();c.update(this._iKey)},update:function(c){this._hasher.update(c);return this},finalize:function(c){var f=
this._hasher,c=f.finalize(c);f.reset();return f.finalize(this._oKey.clone().concat(c))}})})();
(function(){var j=CryptoJS,c=j.lib.WordArray;j.enc.Base64={stringify:function(c){var f=c.words,a=c.sigBytes,b=this._map;c.clamp();for(var c=[],d=0;d<a;d+=3)for(var g=(f[d>>>2]>>>24-8*(d%4)&255)<<16|(f[d+1>>>2]>>>24-8*((d+1)%4)&255)<<8|f[d+2>>>2]>>>24-8*((d+2)%4)&255,j=0;4>j&&d+0.75*j<a;j++)c.push(b.charAt(g>>>6*(3-j)&63));if(f=b.charAt(64))for(;c.length%4;)c.push(f);return c.join("")},parse:function(e){var e=e.replace(/\s/g,""),f=e.length,a=this._map,b=a.charAt(64);b&&(b=e.indexOf(b),-1!=b&&(f=b));
for(var b=[],d=0,g=0;g<f;g++)if(g%4){var j=a.indexOf(e.charAt(g-1))<<2*(g%4),l=a.indexOf(e.charAt(g))>>>6-2*(g%4);b[d>>>2]|=(j|l)<<24-8*(d%4);d++}return c.create(b,d)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
