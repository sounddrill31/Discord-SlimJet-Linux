var g_nextIndex = -1; // record list box selected item
function $(id) {
    return document.getElementById(id);
}

document.onkeydown = function (e) {
    if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        $("photo_shrink_done_domain").click();
    }
}

function IsExitDomain(objSelect, domain) {
    var bExist = false;
    for (var i = 0; i < objSelect.options.length; i++) {
        var itemText = objSelect.options[i].text;
        var pos = itemText.indexOf(":");// Eg: www.sina.com:568, "win.sina.com" is domain,and 568 is solution 
        if (pos > -1) {
            itemText = itemText.substr(0, pos);
        }
        if (itemText == domain) {
            bExist = true;
            break;
        }
    }
    return bExist;
};

function CheckDefaultResolutionValue(resolution) {
    var result = true;
    var resolution = $('default_resolution').value;
    resolution = resolution.replace(/\s/ig, ''); // trim space of resolution by RegExpress
    if (resolution == "") {
        SetErrorInfo("The default value can't be empty");
        $('default_resolution').focus();
        result = false;
    } else {
        var check_result = CheckResolutionValue(resolution);
        if (check_result != "") {
            SetErrorInfo(check_result);
            $('default_resolution').focus();
            result = false;
        }
    }
    return result;
}

function CheckResolutionValue(resolution) {
    var result = "";
    if (isNaN(resolution) == true) {
        result = "The resolution must be digital.";

    } else if (resolution.indexOf(".") > -1) {
        result = "The resolution must be integer.";

    } else if (parseInt(resolution) < 1) {
        result = "The resolution must be greater then 1K";
    }
    return result;
}

function ShowSelectedItem(itemText) {
    var newDomain = itemText;
    var newRln = "";

    //Fetch resolution by parse domain string
    var pos = itemText.indexOf(":");//eg: "sina.com:268",pos is 8
    if (pos > 0)                     //eg: "sina.com",    pos is -1
    {
        newDomain = itemText.substr(0, pos);
        var len = itemText.length - pos;
        newRln = itemText.substr(pos + 1, len);
    }

    // 4. Update UI control by new value
    $('phot_shrink_domain').value = newDomain;
    $('phot_shrink_resolution').value = newRln;
}


function ClearInputBox() {
    $('phot_shrink_domain').value = "";
    $('phot_shrink_resolution').value = "";
}


function ClearThisPage() {
    SetErrorInfo("");
    ClearInputBox();
    g_nextIndex = -1;
    var objSelect = $('photo_shrink_domain_list');
    objSelect.selectedIndex = g_nextIndex;
}

function SetErrorInfo(message) {
    $('label_info').innerText = message;
}

function loadDomainList(domainList) {
    // Clear the list box
    var objSelect = $('photo_shrink_domain_list');
    objSelect.length = 0;


    if (domainList == "") return;

    // Parse string,extract domain and its resolution,delimiter is semicolon
    // eg |domainList| is "sina.com;google.com.hk:24;www.abc.org"
    //    extract to  "sina.com","google.co.hk:24"  and "www.abc.org"
    var aList = domainList.split(";");	// use Javascrit Lib API: split

    // Create a Option object for every domain,and add it to list box.
    for (var i = 0; i < aList.length; i++) {
        var varItem = new Option(aList[i]);
        objSelect.options.add(varItem);
    }

    // set default selected item,initial g_nextIndex = -1,means null
    objSelect.selectedIndex = g_nextIndex;

    SetErrorInfo("");
}

function onOK() {
    if (CheckDefaultResolutionValue()) {
        var domainList = "";
        var objSelect = $('photo_shrink_domain_list');
        for (var i = 0; i < objSelect.options.length; i++) {
            domainList = domainList + objSelect[i].text;
            if (i < objSelect.options.length - 1) {
                domainList = domainList + ";";
            }
        }

        default_resolution = $('default_resolution').value;
        document.sjReturnValue = default_resolution + "," + domainList;
        //alert(document.sjReturnValue); //Eg:  12,qq.com:22;sina.com:33
        window.close();
    }
}

function InitDialog(default_resolution,domainList) {

    $('photo_shrink_add_domain').onclick = function (e) {
        SetErrorInfo("");

        // 1. Fetch the domain from list box,and check validation
        var domain = $('phot_shrink_domain').value;
        if (domain == "") return;

        // 2.Check if this domain is exist in list box
        var objSelect = $('photo_shrink_domain_list');
        if (IsExitDomain(objSelect, domain) == true) {
            SetErrorInfo("This domain alread exsits");
            return;
        }

        // 3. Fetch the resolution from HTML Input control,this value can be null,in this case ,instead of default value
        var resolution = $('phot_shrink_resolution').value;
        resolution = resolution.replace(/\s/ig, ''); // trim space of resolution by RegExpress
        if (resolution != "") // resolution value can be null
        {
            var check_result = CheckResolutionValue(resolution);
            if (check_result == "") {
                domain = domain + ":" + resolution;	// Eg: www.sina.com:568, "win.sina.com" is domain,and 568 is solution
            } else {
                SetErrorInfo(check_result);
                return;
            }
        }

        // 4. Create a Option object,and append to the list box
        var varItem = new Option(domain);
        objSelect.options.add(varItem);
        g_nextIndex = objSelect.length - 1;

    };

    $('photo_shrink_remove_domain').onclick = function (e) {
        SetErrorInfo("");

        // 1.Get index of item that is selected
        var objSelect = $('photo_shrink_domain_list');
        if (objSelect.selectedIndex == -1) {
            SetErrorInfo("Please select a domain!");
            return;
        }

        // 2. For convenience,record next item index
        g_nextIndex = -1;
        if (objSelect.selectedIndex < objSelect.length - 1) {
            g_nextIndex = objSelect.selectedIndex;
        } else if (objSelect.length > 1) {
            g_nextIndex = 0;
        }

        // 3.Remove this item by its index
        objSelect.options.remove(objSelect.selectedIndex);

        // 4. Clear input box
        ClearInputBox();

        // 5.Show next item;
        if (g_nextIndex >= 0) {
            ShowSelectedItem(objSelect[g_nextIndex].text);
        }

    };

    $('photo_shrink_change_domain').onclick = function (e) {
        SetErrorInfo("");

        //Fetch the selected item
        var objSelect = $('photo_shrink_domain_list');
        if (objSelect.selectedIndex == -1) {
            SetErrorInfo("Please select a domain!");
            return;
        }

        var pSel = objSelect[objSelect.selectedIndex];

        //   Check if the domain exsit in list box, 
        //   modified domain couldn't be same as other item in list box.
        var domain = $('phot_shrink_domain').value;
        for (var i = 0; i < objSelect.options.length; i++) {
            if (objSelect[i] != pSel) {
                sDomain = objSelect[i].text;
                var pos = sDomain.indexOf(":");
                if (pos > 0) {
                    sDomain = sDomain.substr(0, pos);
                }
                //if this item already existed,and the ignore modification.
                if (sDomain == domain) {
                    SetErrorInfo("This domain alread exsits!");
                    return;
                }
            }
        }

        // Fetch resolution value,and concat to domain 
        var resolution = $('phot_shrink_resolution').value;
        resolution = resolution.replace(/\s/ig, ''); // trim space of resolution by RegExpress
        if (resolution != "") {
            var check_result = CheckResolutionValue(resolution);
            if (check_result == "") {
                domain = domain + ":" + resolution;	// Eg: www.sina.com:568, "win.sina.com" is domain,and 568 is solution
            } else {
                SetErrorInfo(check_result);
                return;
            }
        }

        // Update the list box
        pSel.text = domain;
        g_nextIndex = objSelect.selectedIndex;

    };

    // Select a item in select control
    $('photo_shrink_domain_list').onchange = function (event) {
        SetErrorInfo("");

        var objSelect = $('photo_shrink_domain_list');
        if (objSelect.selectedIndex == -1) return;

        ShowSelectedItem(objSelect[objSelect.selectedIndex].text);
    }

    // Because for the last item in select control, the |onchange| event will not be activated
    $('photo_shrink_domain_list').onfocus = function (event) {

        var objSelect = $('photo_shrink_domain_list');
        if (objSelect.length == 1) {
            SetErrorInfo("");
            ShowSelectedItem(objSelect[0].text);
        }
    }

    $('default_resolution').value = default_resolution;
    loadDomainList(domainList);
}