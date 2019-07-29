import React, {Component} from 'react';


const Details = (props)=>{
    const {username,first_name,last_name,gender,password,status,serial} = props;

    return(
        <p style={{marginTop:'20px'}}>
            Serial : {serial+1} &nbsp;&nbsp;&nbsp;&nbsp;
            Username : {username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Name : {`${first_name} ${last_name}`} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Gender : {gender} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            password : {password} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            status : {status} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
    );
}

export default Details;