import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { useGlobalState, setGlobalState } from './state';

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppConfig } from "./AppConfig";

import { Maps } from "./components/Maps";
import { WeatherAPI } from "./components/WeatherAPI";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Profile } from "./components/Profile";
import { Directions } from "./components/Directions";
import { LocalRoute } from "./components/LocalRoute";
import { TruckerList } from "./components/TruckerList";
import { LoadDetails } from "./components/LoadDetails";


import { Dashboard } from "./components/Dashboard";
import { ButtonDemo } from "./components/ButtonDemo";
import { ChartDemo } from "./components/ChartDemo";
import { Documentation } from "./components/Documentation";
import { FileDemo } from "./components/FileDemo";
import { FloatLabelDemo } from "./components/FloatLabelDemo";
import { FormLayoutDemo } from "./components/FormLayoutDemo";
import { InputDemo } from "./components/InputDemo";
import { ListDemo } from "./components/ListDemo";
import { MenuDemo } from "./components/MenuDemo";
import { MessagesDemo } from "./components/MessagesDemo";
import { MiscDemo } from "./components/MiscDemo";
import { OverlayDemo } from "./components/OverlayDemo";
import { MediaDemo } from "./components/MediaDemo";
import { PanelDemo } from "./components/PanelDemo";
import { TableDemo } from "./components/TableDemo";
import { TreeDemo } from "./components/TreeDemo";
import { InvalidStateDemo } from "./components/InvalidStateDemo";
import { BlocksDemo } from "./components/BlocksDemo";
import { IconsDemo } from "./components/IconsDemo";

import { Crud } from "./pages/Crud";
import { EmptyPage } from "./pages/EmptyPage";
import { TimelineDemo } from "./pages/TimelineDemo";

import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/layout/flags/flags.css";
import "./assets//layout/layout.scss";
import "./App.scss";



const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useGlobalState("isAuthenticated");
    
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;


    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        // setGlobalState("isAuthenticated", false);
    });

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    const menu = [
        {
            label: "Home",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: "/",
                },
            ],
        },
        {
            label: "Farmer Portal",
            icon: "pi pi-fw pi-sitemap",
            items: [
                { label: "Soil Testing", icon: "pi pi-fw pi-id-card", to: "/maps" },
                { label: "Profile", icon: "pi pi-fw pi-id-card", to: "/profile" },
                { label: "SignIn", icon: "pi pi-fw pi-id-card", to: "/signin" },
                { label: "SignUp", icon: "pi pi-fw pi-id-card", to: "/signup" },
                { label: "Directions", icon: "pi pi-fw pi-id-card", to: "/directions" },
                { label: "Local Route", icon: "pi pi-fw pi-id-card", to: "/localroute" },
                { label: "Trucker List", icon: "pi pi-fw pi-id-card", to: "/truckerlist" },
                { label: "Load Details", icon: "pi pi-fw pi-id-card", to: "/loaddetails" },
                
                { label: "formlayout", icon: "pi pi-fw pi-id-card", to: "/formlayout" },
                { label: "input", icon: "pi pi-fw pi-id-card", to: "/input" },
                { label: "floatlabel", icon: "pi pi-fw pi-id-card", to: "/floatlabel" },
                { label: "invalidstate", icon: "pi pi-fw pi-id-card", to: "/invalidstate" },
                { label: "button", icon: "pi pi-fw pi-id-card", to: "/button" },
                { label: "table", icon: "pi pi-fw pi-id-card", to: "/table" },
                { label: "list", icon: "pi pi-fw pi-id-card", to: "/list" },
                { label: "tree", icon: "pi pi-fw pi-id-card", to: "/tree" },
                { label: "panel", icon: "pi pi-fw pi-id-card", to: "/panel" },
                { label: "overlay", icon: "pi pi-fw pi-id-card", to: "/overlay" },
                { label: "media", icon: "pi pi-fw pi-id-card", to: "/media" },
                { label: "menu", icon: "pi pi-fw pi-id-card", to: "/menu" },
                { label: "messages", icon: "pi pi-fw pi-id-card", to: "/messages" },
                { label: "blocks", icon: "pi pi-fw pi-id-card", to: "/blocks" },
                { label: "icons", icon: "pi pi-fw pi-id-card", to: "/icons" },
                { label: "file", icon: "pi pi-fw pi-id-card", to: "/file" },
                { label: "chart", icon: "pi pi-fw pi-id-card", to: "/chart" },
                { label: "misc", icon: "pi pi-fw pi-id-card", to: "/misc" },
                { label: "timeline", icon: "pi pi-fw pi-id-card", to: "/timeline" },
                { label: "crud", icon: "pi pi-fw pi-id-card", to: "/crud" },
                { label: "empty", icon: "pi pi-fw pi-id-card", to: "/empty" },
                { label: "documentation", icon: "pi pi-fw pi-id-card", to: "/documentation" },
            ],
        },
    ];

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                
                    <div className="layout-main">
                    <Switch>
                        <Route path="/formlayout" component={FormLayoutDemo} />
                        <Route path="/input" component={InputDemo} />
                        <Route path="/floatlabel" component={FloatLabelDemo} />
                        <Route path="/invalidstate" component={InvalidStateDemo} />
                        <Route path="/button" component={ButtonDemo} />
                        <Route path="/table" component={TableDemo} />
                        <Route path="/list" component={ListDemo} />
                        <Route path="/tree" component={TreeDemo} />
                        <Route path="/panel" component={PanelDemo} />
                        <Route path="/overlay" component={OverlayDemo} />
                        <Route path="/media" component={MediaDemo} />
                        <Route path="/menu" component={MenuDemo} />
                        <Route path="/messages" component={MessagesDemo} />
                        <Route path="/blocks" component={BlocksDemo} />
                        <Route path="/icons" component={IconsDemo} />
                        <Route path="/file" component={FileDemo} />
                        <Route path="/chart" component={ChartDemo} />
                        <Route path="/misc" component={MiscDemo} />
                        <Route path="/timeline" component={TimelineDemo} />
                        <Route path="/crud" component={Crud} />
                        <Route path="/empty" component={EmptyPage} />
                        <Route path="/documentation" component={Documentation} />

                        <Route
                            path='/'
                            exact
                            render={(props) => isAuthenticated ? <WeatherAPI {...props} /> : <Redirect to="/signin" />}
                        />
                        <Route
                            path='/profile'
                            exact
                            render={(props) => isAuthenticated ? <Profile {...props} /> : <Redirect to="/signin" />}
                        />
                        <Route
                            path='/maps'
                            exact
                            render={(props) => isAuthenticated ? <Maps {...props} /> : <Redirect to="/signin" />}
                        />
                        <Route
                            path='/signin'
                            exact
                            render={(props) => !isAuthenticated ? <SignIn {...props} /> : <Redirect to="/" />}
                        />
                        <Route
                            path='/signup'
                            exact
                            render={(props) => !isAuthenticated ? <SignUp {...props} /> : <Redirect to="/" />}
                        />
                        <Route
                            path='/directions'
                            exact
                            render={(props) => isAuthenticated ? <Directions {...props} /> : <Redirect to="/signin" />}
                        />
                        <Route
                            path='/localroute'
                            exact
                            render={(props) => isAuthenticated ? <LocalRoute {...props} /> : <Redirect to="/signin" />}
                        />
                        <Route
                            path='/truckerlist'
                            exact
                            render={(props) => isAuthenticated ? <TruckerList {...props} /> : <Redirect to="/signin" />}
                        />
                        <Route
                            path='/loaddetails'
                            exact
                            render={(props) => isAuthenticated ? <LoadDetails {...props} /> : <Redirect to="/signin" />}
                        />
                    </Switch>
                    </div>
                

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
        </div>
    );
};

export default App;
