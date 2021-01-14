/**
 *  Get Directions With a Google Map
 * 
 *  http://mikevsweb.com
 *  version: 0.1
 *
 *  Made by Michael C. Breuer
 *  Under MIT License
 *
 * 
 */

;(function ( $, window, document, undefined ) {

    "use strict";
  
    // defaults
    var pluginName = "GetDirectionsWithGoogleMaps";
    var defaults = {
      name: 'name',
      description: 'add description here.',
      latitude: 51.051012,
      longitude: -114.071045,
      zoom: 13
    };
  
    // plugin constructor
    function Plugin ( element, options ) {
      this.element = element;
      this.settings = $.extend( {}, defaults, options );
  
      this._defaults = defaults;
      this._name = pluginName;
  
      // initialize plugin
      this.init();
    }
  
    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
      init: function () {
        var element = '#' + this.element.id;
  
        // Buttons
        this.button(element, this.calculate, '.calculate', {
          "name":"calculate",
          "latitude": this.settings.latitude,
          "longitude": this.settings.longitude,
          "zoom": this.settings.zoom,
          "func": this.map,
          "options": this.options,
          "hq": this.hq,
          "direct": this.getDirections,
          "name": this.settings.name,
          "description": this.settings.description
        });  
  
        this.button(element, this.reset, '.reset', {"name":"reset"});  
  
        // Map
        this.map(this.settings.latitude, this.settings.longitude, this.settings.zoom, {
          "directions": false,
          "options": this.options,
          "hq": this.hq,
          "direct": this.getDirections,
          "name": this.settings.name,
          "description": this.settings.description
        });
      },
  
      // Map
      map: function(latitude, longitude, zoom, params) {
       
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
  
        var lat = latitude;
        var lon = longitude;
        var type = 'ROADMAP';
        var zm = zoom;
        var headquarters = new google.maps.LatLng(lat,lon); 
  
        var mapOptions = params.options(zm, headquarters);
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var headquartersMarker = params.hq(map,headquarters);
        var content = '<h3>' + params.name + '</h3>' + 
          '<p>' + params.description + '</p>';
  
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
  
        headquartersMarker.addListener('click', function() {
          infowindow.open(map, headquartersMarker);
        });
  
        directionsDisplay.setMap(map);
  
        if (params.directions === true) {
          params.direct(directionsService, directionsDisplay, headquarters, params);
        } else { }
        
      },
  
      // Get Directions
      getDirections: function(directionsService, directionsDisplay, headquarters, params) {
         var start = $('#FindMeOnGoogleMap input[type=text]').val();
         var end = headquarters;
         var mode = $('#FindMeOnGoogleMap select').val();
  
         directionsService.route({
            origin: start,
            destination: end,
            travelMode: mode
         }, function(response, status) {
            if (status === 'OK') {
               directionsDisplay.setDirections(response);
             } else {
               console.log('Directions request failed due to ' + status);
             }
           });
      },
  
      options: function(zoom, headquarters) {
        return {
          zoom:zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: headquarters
        } 
      },
  
      // marker for hq
      hq: function(map, headquarters) {
        return new google.maps.Marker({
          position: headquarters,
          map: map,
          animation: google.maps.Animation.DROP,
          zIndex:99999
        });
      },
  
      // Button
      button: function(el, func, cls, params) {
        $(el + ' ' + cls).on( "click touch", function(event) {
          func(el,params);
        });
      },
  
      // Reset Map
      reset: function(el,params) {
        var name = params.name;
        console.log(name + ' function goes here');
      },
  
      // Calculate Directions
      calculate: function(el, params) {
        params.func(params.latitude, params.longitude, params.zoom, {
          "directions":true,
          "options": params.options,
          "hq": params.hq,
          "direct": params.direct,
          "travelMode": params.travelMode,
          "name": params.name,
          "description": params.description,
        });
      }
  
    });
  
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
      return this.each(function() {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
          $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
        }
      });
    };
  
  })( jQuery, window, document );