var allUserDefinedProxiesList_ = [];
var initSelectedProxyIndex_ = -1;
var currentSelectedProxyIndex_ = -1;

function $(id) {
    return document.getElementById(id);
}

document.onkeydown = function (e) {
    if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        $("proxy_manager_page_confirm").click();
    }
}

function handleVisibleChange() {
	$("proxy_list").options.length = 0;
	for (var i = 0; i < allUserDefinedProxiesList_.length; i++) {
		$("proxy_list").options.add(new Option(allUserDefinedProxiesList_[i].ProxyName, i));
	}

    //display the data kProxy when kProxy is one of kUserDefinedProxies,
	//otherwise display the first one
	if (initSelectedProxyIndex_ >= 0) {
		$("proxy_list").options[initSelectedProxyIndex_].selected = true;
		setProxyContentView(initSelectedProxyIndex_);
		currentSelectedProxyIndex_ = initSelectedProxyIndex_;
	} else if ($("proxy_list").options.length > 0) {
		$("proxy_list").options[0].selected = true;
		setProxyContentView(0);
		currentSelectedProxyIndex_ = 0;
	} else {
		clearConfigPage();
		setForNoData(true);
	}
}

function setProxyContentView(index) {
    clearConfigPage();
    var mode = allUserDefinedProxiesList_[index].mode;
    var server = allUserDefinedProxiesList_[index].server;
    var pac_url = allUserDefinedProxiesList_[index].pac_url;
    var bypass_list = allUserDefinedProxiesList_[index].bypass_list;
    var pac_mandatory = allUserDefinedProxiesList_[index].pac_mandatory;
    var ProxyName = allUserDefinedProxiesList_[index].ProxyName;

    $("proxy_name").value = ProxyName;
    $("pac_url").value = pac_url;
    $("bypass_list").value = bypass_list;
    //proxy is fixed server
    if (mode == "fixed_servers") {
        handleUseFixedPrxoyRadioClick();
        if (server == "")
            return;
        var proxies = server.split(';');
        for (var i = 0; i < proxies.length; i++) {
            if (proxies[i] == "")
                break;
            var arr = proxies[i].split('=');
            var url_scheme = "", proxy_url, proxy_scheme, server_port, proxy_server = "", proxy_port = "";
            if (arr.length > 1)	//url_scheme=proxy_url
            {
                url_scheme = arr[0];
                proxy_url = arr[1];
            }
            else	//url scheme not specified.
                proxy_url = arr[0];

            var p = proxy_url.indexOf("://");
            if (p >= 0) //proxy scheme specified, e.g., sock4:// or socks5://
            {
                proxy_scheme = proxy_url.substr(0, p);
                server_port = proxy_url.substr(p + 3);
            }
            else
                server_port = proxy_url;

            //If proxy url is direct://, server_port might be an empty string.
            if (server_port != "") {
                arr = server_port.split(':');
                proxy_server = arr[0];
                if (arr.length > 1) proxy_port = arr[1];
            }

            switch (url_scheme) {
                case "http":
                    $("http_server").value = proxy_server;
                    $("http_port").value = proxy_port;
                    break;
                case "https":
                    $("https_server").value = proxy_server;
                    $("https_port").value = proxy_port;
                    break;
                case "ftp":
                    $("ftp_server").value = proxy_server;
                    $("ftp_port").value = proxy_port;
                    break;
                case "socks":
                    $("socks_server").value = proxy_server;
                    $("socks_port").value = proxy_port;
                    $("socks4").checked = (proxy_scheme != "socks5");
                    $("socks5").checked = (proxy_scheme == "socks5");
                    break;
                case "":
                    $("http_server").value = proxy_server;
                    $("http_port").value = proxy_port;
                    $("app_to_all").checked = true;
                    break;
            }
        }

        setForHttpToAllChecked($("app_to_all").checked);
    } else if (mode == "pac_script") { //proxy is pac script
        handleUsePacRadioClick();
    } else {
        $("use_fixed_proxy").checked = false;
        $("use_pac").checked = false;
        setForUseFixedProxyChecked(false);
        $("pac_url").disabled = true;
    }
}



//change view for |app_to_all| checked
function setForHttpToAllChecked(checked) {
    $("https_server").disabled = checked;
    $("https_port").disabled = checked;
    $("ftp_server").disabled = checked;
    $("ftp_port").disabled = checked;
    $("socks_server").disabled = checked;
    $("socks_port").disabled = checked;
    $("socks4").disabled = checked;
    $("socks5").disabled = checked;
}

//when |use_fixed_proxy| is checked, http_server | http_port |app_to_all | should 
// be abled,|pac_url| should be disabled.when |use_fixed_proxy| is  not checked,opposite.
function setForUseFixedProxyChecked(checked) {
    $("http_server").disabled = !checked;
    $("http_port").disabled = !checked;
    $("app_to_all").disabled = !checked;
    if (!checked) {
        setForHttpToAllChecked(true);
    } else {
        setForHttpToAllChecked($("app_to_all").checked);
    }
    $("pac_url").disabled = checked;
}

//handle for |use_fixed_proxy| checked
function handleUseFixedPrxoyRadioClick() {
    $("use_fixed_proxy").checked = true;
    $("use_pac").checked = false;
    setForUseFixedProxyChecked(true);
}

//handle for |use_pac| checked
function handleUsePacRadioClick() {
    $("use_fixed_proxy").checked = false;
    $("use_pac").checked = true;
    setForUseFixedProxyChecked(false);
}

//handle for |app_to_all| checked
function handleAppToAllCheckBoxClick() {
    setForHttpToAllChecked($("app_to_all").checked);
}

function isProxyNameExisted(name) {
    for (var i = 0; i < $("proxy_list").options.length; i++) {
        if ($("proxy_list").options[i].text == name)
            return true;
    }
    return false;
}

//handle for |new_proxy| pressed,save current proxy ,create a new proxy
function handleNewProxyButtonClick() {

    if ($("proxy_list").options.length >= 20) {
        alert(document.getElementById("maxItems").innerText);
        return;
    }

    if ($("proxy_list").options.length == 0)
        setForNoData(false);
    saveCurrentSelectedProxy();
    clearConfigPage();
    var index = $("proxy_list").options.length;
    var name;
    for (var i = index; ; i++) {
        name = "proxy" + i;
        if (!isProxyNameExisted(name))
            break;
    }
    var newProxy = {
        ProxyName: name,
        mode: "fixed_servers",
        server: "",
        pac_url: "",
        bypass_list: "<local>",
        pac_mandatory: "",
    };
    allUserDefinedProxiesList_.push(newProxy);
    setProxyContentView(index);
    $("proxy_list").options.add(new Option(newProxy.ProxyName, index));
    $("proxy_list").options[index].selected = true;
    currentSelectedProxyIndex_ = index;
}

//handle for |delete_proxy| pressed,delete current proxy
function handleDeleteProxyButtonClick() {
    if (currentSelectedProxyIndex_ < 0)
        return;
    allUserDefinedProxiesList_.splice(currentSelectedProxyIndex_, 1);
    $("proxy_list").options.remove(currentSelectedProxyIndex_);
    clearConfigPage();
    var direct = false;
    if (currentSelectedProxyIndex_ == initSelectedProxyIndex_) {
        direct = true;
    }

    if ($("proxy_list").options.length != 0) {
        if (currentSelectedProxyIndex_ >= $("proxy_list").options.length)
            currentSelectedProxyIndex_ = $("proxy_list").options.length - 1;
        $("proxy_list").options[currentSelectedProxyIndex_].selected = true;
        setProxyContentView(currentSelectedProxyIndex_);
    } else {
        currentSelectedProxyIndex_ = -1;
        setForNoData(true);
    }

    if (direct) {
        //chrome.send("setSelectedProxy", [0]);
        BrowserOptions.getInstance().setUsedOptionForProxy_(0);
        initSelectedProxyIndex_ = -1;
    }
}

// clear the content of all views
function clearConfigPage() {
    $("http_server").value = "";
    $("http_port").value = "";
    $("https_server").value = "";
    $("https_port").value = "";
    $("ftp_server").value = "";
    $("ftp_port").value = "";
    $("socks_server").value = "";
    $("socks_port").value = "";
    $("use_fixed_proxy").checked = false;
    $("use_pac").checked = false;
    $("proxy_name").value = "";
    $("pac_url").value = "";
    $("bypass_list").value = "";
    $("app_to_all").checked = false;
}

//save data to allUserDefinedProxiesList_
function saveCurrentSelectedProxy() {
    var index = currentSelectedProxyIndex_;
    if (index < 0)
        return;
    allUserDefinedProxiesList_[index].ProxyName = $("proxy_name").value;
    allUserDefinedProxiesList_[index].pac_url = $("pac_url").value;
    allUserDefinedProxiesList_[index].bypass_list = $("bypass_list").value;
    allUserDefinedProxiesList_[index].pac_mandatory = "";
    if ($("use_fixed_proxy").checked) {
        allUserDefinedProxiesList_[index].mode = "fixed_servers";
        allUserDefinedProxiesList_[index].server = createServerString();
    } else {
        allUserDefinedProxiesList_[index].mode = "pac_script";
    }
}

//use |app_to_all| |http_server| |http_port|,and so on ,
function createServerString() {
    var server = "";
    if ($("app_to_all").checked) {
        server += $("http_server").value.trim();
        if (($("http_port").value != "") && (!isNaN($("http_port").value))) {
            server += ":" + $("http_port").value;
        }
    } else {
        if ($("http_server").value != "") {
            server += "http=" + $("http_server").value;
            if (($("http_port").value != "") && (!isNaN($("http_port").value))) {
                server += ":" + $("http_port").value;
            }
            server += ";";
        }

        if ($("https_server").value != "") {
            server += "https=" + $("https_server").value;
            if (($("https_port").value != "") && (!isNaN($("https_port").value))) {
                server += ":" + $("https_port").value;
            }
            server += ";";
        }

        if ($("ftp_server").value != "") {
            server += "ftp=" + $("ftp_server").value;
            if (($("ftp_port").value != "") && (!isNaN($("ftp_port").value))) {
                server += ":" + $("ftp_port").value;
            }
            server += ";";
        }
        else if ($("app_to_all").checked == false)
            server += "ftp=direct://;";	//use direct connection for ftp protocol unless ftp proxy is specified or http proxy is specified and applied to all protocols.

        if ($("socks_server").value != "") {
            if ($("socks4").checked) {
                server += "socks=socks4://" + $("socks_server").value;
            } else {
                server += "socks=socks5://" + $("socks_server").value;
            }
            if (($("socks_port").value != "") && (!isNaN($("socks_port").value))) {
                server += ":" + $("socks_port").value;
            }
            server += ";";
        }

        if (server.substr(server.length - 1) == ";") server = server.substr(0, server.length - 1);
        if (server == "") server = "direct://"
    }

    return server;
}

//handle for change choosen option
function handleProxyListChange(e) {
   saveCurrentSelectedProxy();
   clearConfigPage();
   setProxyContentView(e.target.selectedIndex);
   currentSelectedProxyIndex_ = e.target.selectedIndex;
    $("proxy_list").options[currentSelectedProxyIndex_].selected = true;
}

//handle for done button pressed
function onOK() {
    saveCurrentSelectedProxy();
    var s = '';
    for (var index = 0; index < allUserDefinedProxiesList_.length ; index++) {
        s += allUserDefinedProxiesList_[index].ProxyName;
        s += ',';
        s += allUserDefinedProxiesList_[index].bypass_list;
        s += ',';
        s += allUserDefinedProxiesList_[index].mode;
        s += ',';
        s += allUserDefinedProxiesList_[index].pac_mandatory;
        s += ',';
        s += allUserDefinedProxiesList_[index].pac_url;
        s += ',';
        s += allUserDefinedProxiesList_[index].server;
        if (index + 1 < allUserDefinedProxiesList_.length) {
            s += ',';
        }
    }
    if(allUserDefinedProxiesList_.length == 0 ){
        s = 'NoUserDefineProxy';
    }
    document.sjReturnValue = s;
    //console.log(document.sjReturnValue);
    window.close();
}

//handle for proxy name changed
function handleProxyNameChange() {
    if (currentSelectedProxyIndex_ < 0)
        return;
    $("proxy_list").options[currentSelectedProxyIndex_].text = $("proxy_name").value;
}

//no data, disable view
function  setForNoData(isNoData) {
    setForHttpToAllChecked(isNoData);
    $("http_server").disabled = isNoData;
    $("http_port").disabled = isNoData;
    $("use_fixed_proxy").disabled = isNoData;
    $("app_to_all").disabled = isNoData;
    $("use_pac").disabled = isNoData;
    $("proxy_name").disabled = isNoData;
    $("socks4").disabled = isNoData;
    $("socks5").disabled = isNoData;
    $("pac_url").disabled = isNoData;
    $("bypass_list").disabled = isNoData;
    $('delete_proxy').disabled = isNoData;
}

function InitDialog(entries, ProxyIndex) {
    $('use_fixed_proxy').onclick = handleUseFixedPrxoyRadioClick;
    $('use_pac').onclick = handleUsePacRadioClick;
    $('app_to_all').onclick = handleAppToAllCheckBoxClick;
    $('new_proxy').onclick = handleNewProxyButtonClick;
    $('delete_proxy').onclick = handleDeleteProxyButtonClick;
    $('proxy_list').onchange = handleProxyListChange;
    $('proxy_name').onchange = handleProxyNameChange;
        
    allUserDefinedProxiesList_ = entries;
    initSelectedProxyIndex_ = ProxyIndex;
    handleVisibleChange();
}