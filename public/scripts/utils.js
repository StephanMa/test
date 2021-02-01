var i = '0';
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getFile(url) {
  // 1. Create a new XMLHttpRequest object
  let xhr = new XMLHttpRequest();
  var result;
  // 2. Configure it: GET-request for the URL /article/.../load
  xhr.open('GET', url);

  // 3. Send the request over the network
  xhr.send();

  // 4. This will be called after the response is received
  xhr.onload = function () {
    if (xhr.status !== 200) {
      // analyze HTTP status of the response
      alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    } else {
      // show the result
      //alert(`Done, got ${xhr.response.length} bytes`); // response is the server response
      showResult(xhr.response);
    }
  };

  xhr.onerror = function () {
    alert('Request failed');
  };
}
function showResult(xmlString) {
  var xml = new DOMParser().parseFromString(xmlString, 'text/xml');

  var result;

  if (xml.evaluate) {
    var resultPers = xml.evaluate(
      '//tei:respStmt/tei:persName',
      xml,
      nsResolver,
      XPathResult.STRING_TYPE,
      null
    );
    var resultJahrgang = xml.evaluate(
      '//tei:sourceDesc//tei:publicationStmt/tei:date',
      xml,
      nsResolver,
      XPathResult.STRING_TYPE,
      null
    );
    var resultAusgabe = xml.evaluate(
      '//tei:sourceDesc//tei:seriesStmt/tei:biblScope[@unit="volume"]',
      xml,
      nsResolver,
      XPathResult.STRING_TYPE,
      null
    );
    //console.log(resultJahrgang.stringValue,resultAusgabe.stringValue, resultPers.stringValue);
    result = {
      person: resultPers.stringValue,
      pubDate: resultJahrgang.stringValue,
      volume: resultAusgabe.stringValue,
    };
    //console.log(JSON.stringify(result));
  } else if (window.ActiveXObject || xhttp.responseType == 'msxml-document') {
    xml.setProperty('SelectionLanguage', 'XPath');
    nodes = xml.selectNodes(path);
    for (i = 0; i < nodes.length; i++) {
      txt += nodes[i].childNodes[0].nodeValue + '<br>';
    }
  }
  //console.log(result);
  addTableRow(result);
}

function addTableRow(dataObject) {
  // get data container

  var bgw = 'bg-white';
  var bgg = 'bg-gray-50';
  var bg;

  if (i === '0') {
    bg = bgw;
    i = '1';
  } else {
    bg = bgg;
    i = '0';
  }

  if (dataObject.person) {

    var link =
      '<a href="https://stephanma.github.io/test/public/HTML/' +
      dataObject.pubDate +
      '_' +
      dataObject.volume; // + ".html";

    var xml =
      '<tr class="' +
      bg +
      '"><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">' +
      dataObject.pubDate +
      '</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' +
      dataObject.volume +
      '</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' +
      dataObject.person +
      '</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">' +
      link +
      '" class="text-indigo-600 hover:text-indigo-900">Anzeige</a></td></tr>';

    $('.data').append(xml);
  }
}

function nsResolver(prefix) {
  var ns = {
    tei: 'http://www.tei-c.org/ns/1.0',
  };
  return ns[prefix] || null;
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getRepoInfo(url) {
  // 1. Create a new XMLHttpRequest object
  let xhr = new XMLHttpRequest();

  // 2. Configure it: GET-request for the URL /article/.../load
  xhr.open('GET', url);

  // 3. Send the request over the network
  xhr.send();

  // 4. This will be called after the response is received
  xhr.onload = function () {
    if (xhr.status !== 200) {
      // analyze HTTP status of the response
      alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    } else {
      // show the result
      var jObject = JSON.parse(xhr.response);

      var tree = jObject.tree;
      var arrReturn = [];
      for (var i = 0; i < tree.length; i++) {
        var obj = tree[i];
        var xmlPath = obj.path;
        var arrPath = obj.path.split("/");
        //console.log(arrPath[arrPath.length-1]);
        var arrFile = arrPath[arrPath.length-1].split(".");
        var strKey = arrFile[0];
        strKey = strKey.replace("_", "");
        //console.log(strKey);
        //console.log(obj);
        if (/\.xml$/i.test(xmlPath)) {
          arrReturn[strKey] = obj;
          //console.log(strKey);
        }
      }

      
      arrReturn.sort();
      //console.log(arrReturn);
      for(var key in arrReturn){
        var i = arrReturn[key];
        console.log(key);
        var path =
          'https://raw.githubusercontent.com/StephanMa/test/master/' + i.path;
        getFile(path);
      };
    }
  };
}
getRepoInfo(
  'https://api.github.com/repos/StephanMa/test/git/trees/master?recursive=1'
);
