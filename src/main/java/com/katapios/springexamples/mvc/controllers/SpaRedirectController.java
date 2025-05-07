package com.katapios.springexamples.mvc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaRedirectController {
    @RequestMapping(value = {
            "/",
            "/{path:^(?!api|assets|static|.*\\..*).*$}",
            "/**/{path:^(?!api|assets|static|.*\\..*).*$}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
