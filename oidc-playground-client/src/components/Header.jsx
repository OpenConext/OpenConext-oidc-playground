import React from "react";
import I18n from "i18n-js";
import {Link} from "react-router-dom";
import logo from "../images/surflogo.png";
import "./Header.scss";

export default class Header extends React.PureComponent {

    constructor() {
        super();
        this.state = {
            dropDownActive: false
        };
    }


    render() {
        return (
            <div className={`header-container`}>
                <div className="header">
                    <Link to="/"><img className="logo" src={logo} alt=""/></Link>

                    <p className="title first">{I18n.t("header.title")}</p>
                    <ul className="links">
                        <li className="help border-left">
                            <a href={I18n.t("header.links.helpUrl")} rel="noopener noreferrer"
                               target="_blank">{I18n.t("header.links.help")}</a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
