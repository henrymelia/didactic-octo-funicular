var Sandbox =  {
    create : function (core, module_selector) {
        var CONTAINER = core.dom.query('#' + module_selector);

        if (sessionStorage.token === null) {

        }

        return {
            find : function (selector) {
                return CONTAINER.query(selector);
            },
            addEvent : function (element, type, fn) {
                core.dom.bind(element, type, fn);           
            },
            removeEvent : function (element, type, fn) {
                core.dom.unbind(element, type, fn);              
            },
            notify : function (evt) {
                if (core.is_obj(evt) && evt.type) {
                    core.triggerEvent(evt);
                }
            },
            listen : function (evts) {
                if (core.is_obj(evts)) {
                    core.registerEvents(evts, module_selector);
                }
            },
            ignore : function (evts) {
                if (core.is_arr) {
                    core.removeEvents(evts, module_selector);
                }   
            },
            create_element : function (el, config) {
                var i, child, text;
                el = core.dom.create(el);
                
                if (config) {
                    if (config.children && core.is_arr(config.children)) {
                        i = 0;
                        while(child = config.children[i]) {
                            el.appendChild(child);
                            i++;
                        }
                        delete config.children;
                    }
                    if (config.text) {
                        el.appendChild(document.createTextNode(config.text));
                        delete config.text;
                    }
                    core.dom.apply_attrs(el, config);
                }
                return el;
            },
            removeElement : function (el) {
                return core.dom.remove(el);
            },
            appendTo : function (el, toEl) {
                return core.dom.appendTo(el, toEl);
            },
            prependTo : function (el, toEl) {
                return core.dom.prependTo(el, toEl);
            },
            clone : function (el) {
                return core.dom.clone(el);
            },
            ajax : function (config) {
                return core.ajax(config);
            },
            getUrlParameter : function (urlParam) {
                return core.getUrlParameter(urlParam);
            },
            loginViaAjax : function (usernameParam, passwordParam, successCallback) {
                return core.ajax({
                    url: '/auth.json',
                    type: 'POST',
                    dataType: "json",
                    data: {
                        username: usernameParam,
                        password: passwordParam
                    },
                    success: function (loginResponse) {
                        if (loginResponse.success) {
                            if (loginResponse.token) {
                                //sessionToken = loginResponse.token;
                                sessionStorage.token = loginResponse.token;
                            }
                        }

                        successCallback(loginResponse);
                    }
                });
            },
            logout : function () {
                delete sessionStorage.token;
                window.location.href = '/login';
            },
            getProductsViaAjax : function (successCallback) {
                return core.ajax({
                    url: '/products.json',
                    type: 'GET',
                    dataType: "json",
                    data: {
                        //token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                        token: sessionStorage.token
                    },
                    success: successCallback,
                    error: function () {
                        window.location.href = '/login';
                    }
                });
            },
            redirectTo : function (url) {
                //window.location.href = url + '?token=' + sessionToken;
                window.location.href = url;
            },
            showMainView: function () {
                core.fadeIn('div#main', 'fast');
            }
        };
    }
}
