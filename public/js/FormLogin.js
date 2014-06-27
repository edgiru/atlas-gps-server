function FormLogin(){
    var el;
    this.init = function(){
        var scope = this;
        el = {
            login: document.getElementById("login"),
            pass: document.getElementById("password"),
            confirm_pass: document.getElementById("confirm_password"),
            submit: document.getElementById('submit'),
            registration: document.getElementById('registration')

        }

        if(el.submit){
            el.submit.onclick = function(){
                scope.sendData(el.login.value, el.pass.value)
            }

            window.onkeypress =  zx;
            function zx(e){
                var charCode = (typeof e.which == "number") ? e.which : e.keyCode
                if(charCode==13){
                    scope.sendData(el.login.value, el.pass.value)
                }
            }
        }

        if(el.registration){
            el.registration.onclick = function(){
                scope.sendRegistrationData(el.login.value, el.pass.value, el.confirm_pass.value)
            }
        }


        var indx = document.getElementById("indexForm");
        indx.style.width = window.width + 'px';
    }
    this.sendData = function(login, pass, success){
        var xhr = getXmlHttp();
        var mess = {
            login: login,
            pass: pass
        }
        xhr.open("POST", "/regist.html", true);
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4 && xhr.status==200){
                window.location.href = '/login.html'
                if (success){
                    success();
                }
            }else if(xhr.readyState==4 && xhr.status==404){
                window.location.href = xhr.responseText;
            }
        }
        xhr.send(JSON.stringify(mess));
        return false;
    }
    this.sendRegistrationData = function(login, pass, confirm_pass, success){
        var xhr = getXmlHttp();
        var mess = {
            login: login,
            pass: pass,
            confirm_pass: confirm_pass
        }
        xhr.open("POST", "/newregist", true);
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4 && xhr.status==200){
                window.location.href = xhr.responseText
                if (success){
                    success();
                }
            }else if(xhr.readyState==4 && xhr.status==404){
                window.location.href = xhr.responseText;
            }else if(xhr.readyState==4 && xhr.status==500){
                window.location.href = xhr.responseText;
            }
        }
        xhr.send(JSON.stringify(mess));
        return false;
    }



    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    };


}
var formLogin = new FormLogin();

