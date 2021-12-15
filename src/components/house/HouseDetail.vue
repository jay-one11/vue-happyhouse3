<template>
  <table v-if="house" class="mt-3 mb-3">
    <tr>
      <td
        ><h3>{{ house.아파트 }}</h3></td
      >
    </tr>
    <tr class="mb-2 mt-1">
      <!-- <td
        ><img :src="require('@/assets/apt.png')" fluid-grow></td> -->
    <div class="map_wrap">
    <div id="map" style="position:relative;overflow:hidden;"></div>
    <ul id="category">
        <li id="BK9" data-order="0"> 
            <span class="category_bg bank"></span>
            은행
        </li>       
        <li id="MT1" data-order="1"> 
            <span class="category_bg mart"></span>
            마트
        </li>  
        <li id="PM9" data-order="2"> 
            <span class="category_bg pharmacy"></span>
            약국
        </li>  
        <li id="OL7" data-order="3"> 
            <span class="category_bg oil"></span>
            주유소
        </li>  
        <li id="CE7" data-order="4"> 
            <span class="category_bg cafe"></span>
            카페
        </li>  
        <li id="CS2" data-order="5"> 
            <span class="category_bg store"></span>
            편의점
        </li>      
      </ul>
    </div>
    </tr>
    <tr>
      <td>
        <span show variant="secondary"
          >일련번호 : {{ house.일련번호 }}</span
        >
      </td>
    </tr>
    <tr>
      <td>
        <span show variant="primary">
          아파트 이름 : {{ house.아파트 }}
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <span show variant="info">법정동 : {{ house.법정동 }} </span>
      </td>
    </tr>
    <tr>
      <td>
        <span show variant="warning">층수 : {{ house.층 }}층</span>
      </td>
    </tr>
    <tr>
      <td>
        <span show variant="danger"
          >거래금액 :
          {{
            (parseInt(house.거래금액.replace(",", "")) * 10000) | price
          }}원</span
        >
      </td>
    </tr>
  </table>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=2a48ef6e6042a75e2c924cee6c7330fd&libraries=services"></script>
<script>
import { mapState, mapActions } from "vuex";

const houseStore = "houseStore";

export default {
  name: "HouseDetail",
  data() {
    return {
      next : null,
      placeOverlay : null,
      contentNode : null,
      markers : [],
      currCategory : '',
      mapContainer : null,
      mapOption : null,
      map : null,
      ps : null,
      order : null,
      category : null,
      children : null,
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap()
    } else {
      const script = document.createElement('script');
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=2a48ef6e6042a75e2c924cee6c7330fd&libraries=services';
      document.head.appendChild(script)
    }
    //console.log(this.house);
  },
  computed: {
    ...mapState(houseStore, ["house","starbuckses"]),
  },
  filters: {
    price(value) {
      if (!value) return value;
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
  },
  methods: {
    ...mapActions(houseStore, ["getStarbucks"]),
    initMap () {

      
      this.placeOverlay = new kakao.maps.CustomOverlay({zIndex:1});

      this.contentNode = document.createElement('div');
      // console.log(this.contentNode);
      this.markers = [];
      this.currCategory = '';

      this.mapContainer = document.getElementById('map');
      this.mapOption = {
        center : new kakao.maps.LatLng(33.450701, 126.570667),
        level : 3
      };

     var placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}), 
    contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
    markers = [], // 마커를 담을 배열입니다
    currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다
 
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map); 

// 지도에 idle 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', searchPlaces);

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다 
contentNode.className = 'placeinfo_wrap';

// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다 
addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

// 커스텀 오버레이 컨텐츠를 설정합니다
placeOverlay.setContent(contentNode);  

// 각 카테고리에 클릭 이벤트를 등록합니다
addCategoryClickEvent();

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent('on' + type, callback);
    }
}

// 카테고리 검색을 요청하는 함수입니다
function searchPlaces() {
    if (!currCategory) {
        return;
    }
    
    // 커스텀 오버레이를 숨깁니다 
    placeOverlay.setMap(null);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();
    
    ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true}); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요

    } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
        
    }
}

// 지도에 마커를 표출하는 함수입니다
function displayPlaces(places) {

    // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
    // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
    var order = document.getElementById(currCategory).getAttribute('data-order');

    

    for ( var i=0; i<places.length; i++ ) {

            // 마커를 생성하고 지도에 표시합니다
            var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

            // 마커와 검색결과 항목을 클릭 했을 때
            // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
            (function(marker, place) {
                kakao.maps.event.addListener(marker, 'click', function() {
                    displayPlaceInfo(place);
                });
            })(marker, places[i]);
    }
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, order) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo (place) {
    var content = '<div class="placeinfo">' +
                    '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';   

    if (place.road_address_name) {
        content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
                    '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
    }  else {
        content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
    }                
   
    content += '    <span class="tel">' + place.phone + '</span>' + 
                '</div>' + 
                '<div class="after"></div>';

    contentNode.innerHTML = content;
    placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(map);  
}


// 각 카테고리에 클릭 이벤트를 등록합니다
function addCategoryClickEvent() {
    var category = document.getElementById('category'),
        children = category.children;

    for (var i=0; i<children.length; i++) {
        children[i].onclick = onClickCategory;
    }
}

// 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickCategory() {
    var id = this.id,
        className = this.className;

    placeOverlay.setMap(null);

    if (className === 'on') {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
    } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
    }
}

// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
function changeCategoryClass(el) {
    var category = document.getElementById('category'),
        children = category.children,
        i;

    for ( i=0; i<children.length; i++ ) {
        children[i].className = '';
    }

    if (el) {
        el.className = 'on';
    } 
} 

this.updateMap(map);

    },
    addEventHandle(target, type, callback){
      // console.log(target.addEventListener); 
      if(target.addEventListener) {
        target.addEventListener(type, callback);
      }else {
        target.attachEvent('on'+type, callback);
      }
      // console.log(target);
    },
    placeSearchCB(data, status, pagenation) {
      if(status === kakao.maps.services.Status.OK){
        displayPlaces(data);
      }else if (status === kakao.maps.services.Status.ZERO_RESULT) {

      }else if (status === kakao.maps.services.Status.ERROR){

      }
    },
    displayPlaces(places) {
      this.order = document.getElementById(this.currCategory).getAttribute('data-order');
      for(var i=0; i<places.length; i++){
        var marker =  addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), this.order);

        (function(marker, place) {
          kakao.maps.event.addListener(marker, 'click', function(){
            displayPlaceInfo(place);
          });
        })(marker, places[i]);

      }
    },
    addMarker(position, order){
       var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });
        marker.setMap(this.map);
        this.markers.push(marker);
        return marker;
    },
    removeMarker(){
      for(var i =0; i<this.markers.length; i++){
        this.markers.setMap(null);
      }
      this.markers = [];
    },
    displayPlaceInfo(){
      var content = '<div class="placeinfo">' +
                    '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';   

      if (place.road_address_name) {
          content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
                      '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
      }  else {
          content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
      }                
    
      content += '    <span class="tel">' + place.phone + '</span>' + 
                  '</div>' + 
                  '<div class="after"></div>';
      this.contentNode.innerHTML = content;
      this.placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
      this.placeOverlay.setMap(this.map);
    },
    addCategoryClickEvent() {
      this.category = document.getElementById('category'),
      this.children = this.category.children;

      for(var i =0; i<this.children.length; i++){
        // console.log(this.children[i]);
        this.children[i].onclick = function(){
          var id = this.id;
          var className = this.className;

          console.log(className);
          //  ??? 알수없는 에러
          //this.placeOverlay.setMap(null);

          if(className === 'on') {
            this.currCategory = '';
            this.changeCategoryClass(null);
            this.removeMarker();
          }else {
            this.currCategory = id;
            this.changeCategoryClass(this);
            this.searchPlaces();
          }
        };
      }
    },
    searchPlaces(){
      if(!this.currCategory){
        return;
      }
      this.placeOverlay.setMap(null);
      removeMarker();
      this.ps.categorySearch(this.currCategory, placeSearchCB, {userMapBounds:true});
    },
    changeCategoryClass(el) {
      var category = document.getElementById('category'),
          children = category.children,
          i;
      
      for( i = 0; i < children.length; i++){
        children[i].className = '' ;
      }
      if(el) {
        el.className = 'on';
      }
    },
    onclickCategory() {
      var id = this.id,
          className = this.className;

      // console.log(id + " " + className);

      this.placeOverlay.setMap(null);

      if(className === 'on') {
        this.currCategory = '';
        this.changeCategoryClass(null);
        this.removeMarker();
      }else {
        this.currCategory = id;
        this.changeCategoryClass(this);
        this.searchPlaces();
      }
    },
    updateMap(map) {
      console.log(map);
      var geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(`${this.house.법정동}+" "+${this.house.지번}`, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          console.log(result[0].y, result[0].x + "위도 경도");
          var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          if(this.marker != null) this.marker.setMap(null);
          console.log(this.marker);
          this.marker = new kakao.maps.Marker({
              map: map,
              position: coords,
              clickable: true,
          });

        this.marker.setMap(map);
        
        // 인포윈도우로 장소에 대한 설명을 표시합니다
        if(this.InfoWindow != null)  this.InfoWindow.setMap(null);
        var content = `<div class="overlaybox">
        <div class="boxtitle">${this.house.아파트}
          <div class="close" title="닫기"></div>
        </div>
        <ul>
            <li>
                <span class="title">일련번호 : ${this.house.일련번호}</span>
            </li>
            <li>
                <span class="title">법정동 : ${this.house.법정동}</span>
            </li>
            <li>
                <span class="title">층수 : ${this.house.층}</span>
            </li>
            <li>
                <span class="title">거래금액 : ${(parseInt(this.house.거래금액.replace(",", "")) * 10000) | this.price} 원</span>
            </li>
        </ul>
        </div>`
        this.InfoWindow = new kakao.maps.CustomOverlay({
              content: content,
              map : map,
              position: coords,
        });
        kakao.maps.event.addListener(this.marker,'click',function(){
          this.InfoWindow.setMap(map);
        });

        map.setCenter(coords);
      }
      });
    },
  },
  updated() {
    this.$nextTick(function() {
      if (this.next != this.house) {
        this.updateMap(this.house);
        this.next = this.house;
      }
    });
  },
   
};

</script>

<style>
img {
  width: 70%;
}

#map {
  width: 1000px;
  height: 600px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}

.map_wrap, .map_wrap * {margin:0; padding:0;font-family:'Malgun Gothic',dotum,'돋움',sans-serif;font-size:12px;}
.map_wrap {position:relative;width:100%;height:350px;}
#category {position:absolute;top:10px;left:10px;border-radius: 5px; border:1px solid #909090;box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);background: #fff;overflow: hidden;z-index: 2;}
#category li {float:left;list-style: none;width:50px;border-right:1px solid #acacac;padding:6px 0;text-align: center; cursor: pointer;}
#category li.on {background: #eee;}
#category li:hover {background: #ffe6e6;border-left:1px solid #acacac;margin-left: -1px;}
#category li:last-child{margin-right:0;border-right:0;}
#category li span {display: block;margin:0 auto 3px;width:27px;height: 28px;}
#category li .category_bg {background:url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png) no-repeat;}
#category li .bank {background-position: -10px 0;}
#category li .mart {background-position: -10px -36px;}
#category li .pharmacy {background-position: -10px -72px;}
#category li .oil {background-position: -10px -108px;}
#category li .cafe {background-position: -10px -144px;}
#category li .store {background-position: -10px -180px;}
#category li.on .category_bg {background-position-x:-46px;}
.placeinfo_wrap {position:absolute;bottom:28px;left:-150px;width:300px;}
.placeinfo {position:relative;width:100%;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;padding-bottom: 10px;background: #fff;}
.placeinfo:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}
.placeinfo_wrap .after {content:'';position:relative;margin-left:-12px;left:50%;width:22px;height:12px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
.placeinfo a, .placeinfo a:hover, .placeinfo a:active{color:#fff;text-decoration: none;}
.placeinfo a, .placeinfo span {display: block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
.placeinfo span {margin:5px 5px 0 5px;cursor: default;font-size:13px;}
.placeinfo .title {font-weight: bold; font-size:14px;border-radius: 6px 6px 0 0;margin: -1px -1px 0 -1px;padding:10px; color: #fff;background: #d95050;background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;}
.placeinfo .tel {color:#0f7833;}
.placeinfo .jibun {color:#999;font-size:11px;margin-top:0;}


.overlaybox {position:relative;width:280px;height:170px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/box_movie.png') no-repeat;}
.overlaybox div, ul {overflow:hidden;margin:0;padding:0;}
.overlaybox li {list-style: none;}
.overlaybox .boxtitle {color:#fff;font-size:16px;font-weight:bold;margin-bottom:8px;}
.overlaybox ul {width:247px;}
.overlaybox li {position:relative;margin-bottom:2px;background:#2b2d36;padding:5px 10px;color:#aaabaf;line-height: 1;}
.overlaybox li span {display:inline-block;}
.overlaybox li .number {font-size:16px;font-weight:bold;}
.overlaybox li .title {font-size:13px;}
.overlaybox li:hover {color:#fff;background:#d24545;}

.close {position: absolute;top: 5px;right: 20px;color: rgb(240, 236, 236);width: 17px;height: 17px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');}
.close:hover {cursor: pointer;}
</style>
