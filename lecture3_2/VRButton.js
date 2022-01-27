/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author NikLever / http://niklever.com
 */

class VRButton{

	constructor( renderer ) {
        this.renderer = renderer;
        
        if ( 'xr' in navigator ) {
            const button =document.createElement('button');
            button.style.display = 'none';
            button.style.height = '40px';
            document.body.appendChild( button );

            navigator.xr.isSessionSupported('immersive-vr').then ((supported) => {
                supported ? this.showEnterVR(button) : this.showWebXRNotFound(
                    button
                ); 
            }) 
		} else {
            const message = document.createElement('a')
            if(window.isSecureContext === false) {
                message.href = document.location.href.replace(/^https:/,'https');
                message.innerHTML = "WEB XR NEED HTTPS"
            }else{
                message.href = 'https://immersivewev.dev'
                message.innerHTML = "WEBXR NOT AVAILABLE"
            }
            this.style.left = '0'
            this.style.width = '100px'
            this.style.textDecoration = 'none'
            this.stylizeElement(message,false);
            message.style.bottom = '0px';
            message.style.opacity = '1'

            document.appendChild(message)
        }

    }

	showEnterVR( button ) {
        let currentSession = null;
        
        button.onmouseenter = function() {
            button.style.fontSize = '12px';
            button.textContent = (currentSession === null )? "ENTER VR": 'EXIT VR';
            button.style.opacity = '1';
        }
        button.onmouseleave = function(){
            button.style.fontSize = '12px';
            button.style.opacity = '0.5'
        }
        
                this.stylizeElement(button, true , 30, true);
                
                button.style.display = '';
                button.style.right = '20px';
                button.style.width = '80px';
                button.cursor.pointer='pointer';
        
           function onSessionStarted( session ) {
               session.addEventListener('end',onSessionEnded);

               self.renderer.xr.setSession( session );
               self.stylizeElement(button,false,12,true);

               button.textContent = "EXIT VR";
               
               currentSession = session;

           }
           function onSessionEnded(){
               currentSession.removeEventListener('end',onSessionEnded);

               self.stylizeElement(button,true,12,true);
               button.textContent = 'ENTER VR'
               
               currentSession = null;

           }
           button.onclick = function(){
               if(currentSession === null){
                   const sessionInit  = {optionalFeatures:['local-floor','bounded-floor']};
                   navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );
               }
               else{
                   currentSession.end()
               }
           }


    }

    disableButton( button ) {

        button.style.cursor = 'auto';
        button.style.opacity = '0.5';
        
        button.onmouseenter = null;
        button.onmouseleave = null;

        button.onclick = null;

    }

    showWebXRNotFound( button ) { 
        this.stylizeElement(button,false);
        this.disableButton(button);

        button.style.display = '';
        button.style.width = '100%';
        button.style.right = '0px';
        button.style.bottom = '0px';
        button.style.border = '';
        button.style.opacity = '1';
        button.style.fontSize = '12px';
        button.textContent = 'VR NOT SUPPORTED';
    }

    stylizeElement( element, green = true, fontSize = 13, ignorePadding = false ) {

        element.style.position = 'absolute';
        element.style.bottom = '20px';
        if (!ignorePadding) element.style.padding = '12px 6px';
        element.style.border = '1px solid #fff';
        element.style.borderRadius = '4px';
        element.style.background = (green) ? 'rgba(20,150,80,1)' : 'rgba(180,20,20,1)';
        element.style.color = '#fff';
        element.style.font = `normal ${fontSize}px sans-serif`;
        element.style.textAlign = 'center';
        element.style.opacity = '0.5';
        element.style.outline = 'none';
        element.style.zIndex = '999';
    }
};

export { VRButton };
