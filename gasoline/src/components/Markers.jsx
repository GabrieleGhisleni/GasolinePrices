

function CreateMarkers(markers){
    return(
        markers.forEach(station => {
            <div>
            <Marker position={[50.5, 30.5]}>
                <Popup>Hello world</Popup>
            </Marker>
            </div>

            
        });
    )
}