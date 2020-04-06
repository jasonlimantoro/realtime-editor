import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faListOl,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";

export const TOOLBARS = [
  {
    label: "bold",
    inlineStyle: "BOLD",
    icon: <FontAwesomeIcon icon={faBold} />,
  },
  {
    label: "italic",
    inlineStyle: "ITALIC",
    icon: <FontAwesomeIcon icon={faItalic} />,
  },
  {
    label: "Numbering",
    blockType: "ordered-list-item",
    icon: <FontAwesomeIcon icon={faListOl} />,
  },
  {
    label: "Bullets",
    blockType: "unordered-list-item",
    icon: <FontAwesomeIcon icon={faListUl} />,
  },
];
