import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { api_connectivity_azure_getProvisioningParameters } from "../api/connectivity";

const AzureDeviceProvisioningService = ( props:{authenticationType:string, setAuthenticationType?:Function, disabled?:boolean } )=>{
    const[ disabled, setDisabled ] = useState<boolean>(false);

    const[ hostname, setHostname ] = useState<string>('');
    const[ idScope, setIdScope ] = useState<string>('');
    const[ regId, setRegId ] = useState<string>('');
    // Symmetric Key
    const[ regKey, setRegKey ] = useState<string>(''); 
    // X.509 Certificates
    const[ cert, setCert ] = useState<string>('');
    const[ pkey, setPKey ] = useState<string>('');

    useEffect(()=>{
        if(typeof(props.disabled) !== 'undefined') setDisabled(props.disabled);
    },[props.disabled]);

    useEffect(()=>{
        getProvisioningParameters();
    },[]);

    // Get Azure Provisioning parameters
    async function getProvisioningParameters(){
        const result = await api_connectivity_azure_getProvisioningParameters();
        console.log(result);
        if( result.message ){

        }
        // Set the parameters in the fields
        if( typeof(result.hostName) === 'string' ) setHostname(result.hostName);
        if( typeof(result.idScope) === 'string' ) setIdScope(result.idScope);
        if( typeof(result.registrationId) === 'string' ) setRegId(result.registrationId);
        if( typeof(result.registrationKey) === 'string' ) setRegKey(result.registrationKey);
        if( typeof(result.certificate) === 'string' ) setCert(result.certificate);
        if( typeof(result.privateKey) === 'string' ) setPKey(result.privateKey);
        // Update the authenticationType
        if( typeof(props.setAuthenticationType) === 'function' && typeof(result.authenticationType) === 'string')
        props.setAuthenticationType( result. authenticationType );
    }
    
    return(
        <>
            <Form>
                <div className="float-right">
                    <Button variant={'danger'} disabled={disabled}>Reprovision</Button>
                </div>
                <h3>Azure Device Provisioning Service</h3>
                <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={2}>Hostname</Form.Label>
                    <Col sm={6}>
                        <Form.Control type={'text'} placeholder={'Hostname'} value={hostname} onChange={(e)=>{setHostname(e.target.value)}} required disabled={disabled}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={2}>ID scope</Form.Label>
                    <Col sm={6}>
                        <Form.Control type={'text'} placeholder={'ID scope'} value={idScope} onChange={(e)=>{setIdScope(e.target.value)}} required disabled={disabled}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={2}>Registration ID</Form.Label>
                    <Col sm={6}>
                        <Form.Control type={'text'} placeholder={'Registration ID'} value={regId} onChange={(e)=>{setRegId(e.target.value)}} required disabled={disabled}/>
                    </Col>
                </Form.Group>
                {/* Conditionally: Shared Access Key */}
                {props.authenticationType === 'sas'?
                    <Form.Group as={Row} className="mb-2">
                        <Form.Label column sm={2}>Shared Access Key</Form.Label>
                        <Col sm={6}>
                            <Form.Control type={'text'} placeholder={'Shared Access Key'} value={regKey} onChange={(e)=>{setRegKey(e.target.value)}} required disabled={disabled}/>
                        </Col>
                    </Form.Group>
                :<></>}
                {/* Conditionally: X.509 Certificates */}
                {props.authenticationType === 'x509'?<>
                    <Form.Group as={Row} className="mb-2">
                        <Form.Label column sm={2}>Certificate</Form.Label>
                        <Col sm={6}>
                            <Form.Control type={'text'} placeholder={'Certificate'} value={cert} onChange={(e)=>{setCert(e.target.value)}} required disabled={disabled}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-2">
                        <Form.Label column sm={2}>Private Key</Form.Label>
                        <Col sm={6}>
                            <Form.Control type={'text'} placeholder={'Private Key'} value={pkey} onChange={(e)=>{setPKey(e.target.value)}} required disabled={disabled}/>
                        </Col>
                    </Form.Group>
                </>:<></>}
                <Button variant={'primary'} disabled={disabled}>Save</Button>&nbsp;
                <Button variant={'danger'} disabled={disabled}>Reset</Button>
            </Form>
        </>
    );
}

export default AzureDeviceProvisioningService;