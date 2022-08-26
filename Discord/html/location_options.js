var indexOfUsa=-1;
var countryList_=[];
var countryCodeList_=[];
var stateOfUsaList_=[];
var countryIndex_=-1;
var stateIndex_=-1;
var address_state_;
var country_code_;


function $(id) {
    return document.getElementById(id);
}

document.onkeydown = function (e) {
    if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        $("my-location-confirm").click();
    }
}

function handleCountryChanged() {
    var my_state=$('my-usa-state');
    var my_province=$('my-province');
    var my_country=$('my-country');
    my_province.disabled=(my_state.selectedIndex!=0);
    if (my_country.selectedIndex==this.indexOfUsa){
        my_province.value='';
        my_province.disabled=true;
    }else{
        my_state.selectedIndex=0;
        my_province.disabled=false;
    }
    saveMyLocation();
}

function handleUsaStateChanged() {
    var my_state=$('my-usa-state');
    var my_province=$('my-province');
    var my_country=$('my-country');
    var i=my_state.selectedIndex;
    var j=-1;
    var index_result=-1;
    if (i>0) {
    my_province.value='';
    my_country.selectedIndex=indexOfUsa;
    }else{
    if (my_country.selectedIndex==indexOfUsa) {
        my_country.selectedIndex=-1;
    }
    }
    my_province.disabled=(my_state.selectedIndex!=0);
}

function onOK() {
    saveMyLocation();
    document.sjReturnValue = country_code_ + "," + $('my-street-address').value + "," + $('my-suite-number').value + "," + $('my-city').value + "," + address_state_ + ","+ $('my-zip-code').value;
    //console.log(document.sjReturnValue);
    window.close();
}

function onCancel() {
    document.sjReturnValue = "";
    window.close();
}

function saveMyLocation() {
    var my_country=$('my-country');
    var usa_states=$('my-usa-state');
    var my_province=$('my-province');
    address_state_ = my_province.value;

    countryIndex_ = my_country.selectedIndex;
    stateIndex_   = usa_states.selectedIndex;
    var i = countryIndex_;
    if(i>=0) country_code_ = countryCodeList_[i];

    if( country_code_ == 'US' ) {
        if(stateIndex_ < 1) {
            address_state_ = '' ;
        } else {
            address_state_ = usa_states.options[usa_states.selectedIndex].text;
        }
    }
}

function loadMyLocation() {
    var countryList=this.countryList_;
    var my_country=$('my-country');
    my_country.length=0;
    var i = 0;
    for (i=0; i<countryList.length; i++) {
        var countryName=countryList[i];
        my_country.options.add(new Option(countryName));
    }
    if(this.countryIndex_ != -1) {
        my_country.selectedIndex=this.countryIndex_;
    }

    var index_result=-1;
    for (i = my_country.length - 1; i >= 0; i--) {
        index_result=my_country[i].value.indexOf('United States');
        if(index_result != -1){
        this.indexOfUsa=i;
        break;
        }
    }

    var stateList=this.stateOfUsaList_;
    var usa_states=$('my-usa-state');
    usa_states.length=0;
    for (i=0; i<stateList.length; i++) {
        var stateName=stateList[i];
        usa_states.options.add(new Option(stateName));
    }
    if(stateIndex_ != -1) {
        usa_states.selectedIndex=stateIndex_;
    }

    var my_province=$('my-province');
    if(my_country.selectedIndex==indexOfUsa) {
        my_province.value='';
        my_province.disabled=true;
    }else{
        my_province.disabled=false;
    }
}



function InitDialog(countryIndex, countryList, countryCodeList, street, apt, city, stateIndex, stateOfUsaList, stateOutOfUSA, zip) {
	countryIndex_		= countryIndex;
	countryList_		= countryList;
	countryCodeList_    = countryCodeList;
	stateIndex_			= stateIndex;
	stateOfUsaList_ = stateOfUsaList;

	$('my-street-address').value = street;
	$('my-suite-number').value   = apt;
	$('my-city').value = city;
	if (stateIndex == -1) {
	    $('my-province').value = stateOutOfUSA;
	}
	$('my-zip-code').value       = zip;
	
	loadMyLocation();
    $('my-country').addEventListener('change', handleCountryChanged);
    $('my-usa-state').addEventListener('change', handleUsaStateChanged);
    $('locationOptionsPageCloseButton').onclick = function (e) { chrome.send("updateWeather"); }
}

function InitDialog2(){
    InitDialog(-1, ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua And Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia And Herzegovina", "Botswana", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote D'ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Federated States Of Micronesia", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iraq", "Ireland", "Islamic Republic Of Iran", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territory - Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Republic Of Korea", "Republic Of Moldova", "Reunion", "Romania", "Russia", "Rwanda", "Saint Kitts And Nevis", "Saint Lucia", "Saint Vincent And The Grenadines", "Samoa", "San Marino", "Sao Tome And Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Thailand", "The Democratic Republic Of The Congo", "The Former Yugoslav Republic Of Macedonia", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad And Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United Republic Of Tanzania", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Virgin Islands - British", "Virgin Islands - U.S.", "Yemen", "Zambia", "Zimbabwe"], ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BR", "IO", "BN", "BG", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CO", "KM", "CG", "CK", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FM", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GN", "GW", "GY", "HT", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IQ", "IE", "IR", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "AN", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "PR", "QA", "KR", "MD", "RE", "RO", "RU", "RW", "KN", "LC", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "ES", "LK", "SD", "SR", "SZ", "SE", "CH", "SY", "TW", "TJ", "TH", "CD", "MK", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB", "TZ", "US", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "YE", "ZM", "ZW"], "street1", "apt1", "city1", -1, ["Outside USA", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],"state1","zip1");
}


