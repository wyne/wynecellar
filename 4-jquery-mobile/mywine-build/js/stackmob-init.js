define(["stackmob"],function(e){var t=window.location.href,n=t.search("http://hollagram_html5_requirejs.stackmob339.stackmobapp.com"),r=t.search("http://dev.hollagram_html5_requirejs.stackmob339.stackmobapp.com"),i=t.search("http://localhost:4567/");return n===0?console.log("init production"):r===0?(e.init({publicKey:"5e504e12-ab45-4c53-a2f0-274cf57d468e",apiVersion:0}),console.log("init dev")):i===0?(e.init({publicKey:"5e504e12-ab45-4c53-a2f0-274cf57d468e",apiVersion:0}),console.log("init local")):(e.init({publicKey:"5e504e12-ab45-4c53-a2f0-274cf57d468e",apiVersion:0}),console.log("phonegap build")),e});