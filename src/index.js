import regeneratorRuntime from "regenerator-runtime";
import "./styles/home.sass";
import './styles/main.sass';
import './styles/header.sass';
import './styles/footer.sass';
import './styles/index.sass';
import './styles/login.sass';
import './styles/form.sass';
import './styles/register.sass';
import './styles/checkbox.css';
import './styles/loading.sass';
import './styles/profile_intro.sass';
import './styles/account/edit_profile.sass';
import './styles/account/change_password.sass';
import './styles/account/delete_password.sass';
import './styles/account/account_info.sass';
import './styles/account/account.sass';
import './styles/test/test.sass';
import './styles/test/history.sass';
import './styles/test/result.sass';
import './styles/range_bar.sass';
import './styles/gauge.sass';
import './styles/tabs.sass';
import './styles/statistics.sass';
import './styles/not_found_page.sass';
import './styles/registered-user-header.sass';
import './styles/auth/authentication.sass';
import './styles/video_intervensi.sass';
import './scripts/web-components/header.js';
import './scripts/web-components/registered-user-header.js';
import './scripts/web-components/footer.js';
import './scripts/web-components/templates/loading.js';

import RouteManager from "./scripts/globals/routes";
import WindowController from './scripts/utils/window-manager';
import UserHelpers from "./scripts/globals/user-helpers";
import RegisteredUserHeader from "./scripts/web-components/registered-user-header.js";
import HeaderElement from "./scripts/web-components/header.js";
import Localization from "./scripts/utils/localization";

let currentURL = ""

const defineHeader = async () => {
    const headerElement = document.querySelector("header")
    headerElement.innerHTML = ""
    if (UserHelpers.isLogin()){
        const chosenHeaderElement = new RegisteredUserHeader()
        await chosenHeaderElement.init();
        headerElement.appendChild(chosenHeaderElement);
        return;    
    }
    const chosenHeaderElement = new HeaderElement()
    await chosenHeaderElement.init();
    headerElement.appendChild(chosenHeaderElement);
}

const defineBodyPage = async () => {
    const bodyElement = document.querySelector('main');    
    const nextURLPage = WindowController.getURLStripParts()[0];
    if (currentURL !== nextURLPage){
        bodyElement.innerHTML = "";
        const pageElement = RouteManager.getPage(nextURLPage);
        await pageElement.init();
        bodyElement.appendChild(pageElement);
        bodyElement.style.visibility = "hidden"
        bodyElement.style.visibility = "visible"
    }
    await Localization.initTranslate();
    currentURL = nextURLPage
};

window.addEventListener("hashchange", async () => {
    await defineHeader();
    await defineBodyPage();
})

window.addEventListener('DOMContentLoaded', async () => {
    await defineHeader();
    await defineBodyPage();
});

if (WindowController.getURLHashValue() === undefined){
    WindowController.setWindowURLHash("home/about");
}