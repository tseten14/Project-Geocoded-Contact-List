var mymap;


//Part 3: Adding Map
const create_map = () => {
    mymap = L.map('mapid').setView([41, -74], 4);
     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
       attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
       maxZoom: 18,
       id: 'mapbox/streets-v11',
       tileSize: 512,
       zoomOffset: -1,
       accessToken: 'pk.eyJ1IjoiYnRoYXBhMyIsImEiOiJja2hqYmtwMjMxd3kwMnF0OW9qbm83eG1iIn0.-cY1kDjXImx1CUySGcGtWA'
     }).addTo(mymap)
     var x = document.getElementsByClassName("tablerow");
     
     for (i = 0; i < x.length; i++) {
        const obj=JSON.parse(x[i].getAttribute("dataobject"));
        const marker = L.marker([obj.Latitude,obj.Longitude]).addTo(mymap);
        x[i].addEventListener("click",()=>{
          mymap.flyTo([ obj.Latitude,obj.Longitude ], 8);
         
        })
        
        marker.on('click',function clickmarker(){
          var popup=L.popup();
          popup
            .setLatLng([obj.Latitude,obj.Longitude])
            .setContent(obj.Firstname+ " " +obj.Lastname+'\n'+" "+obj.Email
            +"    "+ obj.Latitude+" "+obj.Longitude+" "+ obj.Street)
            .openOn(mymap);

        })
      }
      
 }
 //Part 7 Will Search for name
 function myname() {
  // Declare variables
  var input, filter, table, tr, td1,td2 ,i, txtValue;
  input = document.getElementById("inputfornames");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
  
    td1 = tr[i].getElementsByTagName("td")[1] ;
    td2= tr[i].getElementsByTagName("td")[2] ;

    if (td1 || td2) {
      
      txtValue1 = td1.textContent || td1.innerText;//for first name
      txtValue2 = td2.textContent || td2.innerText;//for last name
      txtValue=txtValue1+txtValue2;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//Part 8
//Will search for address
function myaddress() {
  // Declare variables
  var input, filter, table, tr, td1,td2,td3, i, txtValue;
  input = document.getElementById("inputforadd");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
 
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    console.log(tr);
    td = tr[i].getElementsByTagName("td")[3] ;
    td2= tr[i].getElementsByTagName("td")[4] ; 
    td3= tr[i].getElementsByTagName("td")[5] ;  
    td4= tr[i].getElementsByTagName("td")[6] ;  

    if (td ||td2 || td3||td4) {
      txtValue1 = td.textContent || td.innerText;//street
      txtValue2 = td2.textContent || td2.innerText;//city
      txtValue3 = td3.textContent || td3.innerText;//state
      txtValue4 = td4.textContent || td4.innerText;//zip
      txtValue=txtValue1+txtValue2+txtValue3+txtValue4;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}




 