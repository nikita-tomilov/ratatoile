import React from "react";
import "./Dialog.css";

export const Dialog = (props: {renderHeader: () => JSX.Element, renderBody: () => JSX.Element }):JSX.Element => {
    return <>
        {<div className='dialogOverlay'/>}
        {<div className='dialogBody'>
            {props.renderHeader()}
            {props.renderBody()}
        </div>}
    </>
}