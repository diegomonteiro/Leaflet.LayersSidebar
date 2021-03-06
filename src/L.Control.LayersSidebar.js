L.Control.LayersSidebar = L.Control.extend({
    options: {
        position: 'topright',
        menuposition: 'topright', // topleft,topright,bottomleft,bottomright
        width: '300px',
        height: '100%',
        direction: 'horizontal', // vertical or horizontal
        changeperc: '50',
        delay: '1'
    },
    layers: [],

    initialize: function (innerHTML, options, group_layers) {
        L.Util.setOptions(this, options, group_layers);
        this._innerHTML = innerHTML;
        this._isLeftPosition = this.options.menuposition == 'topleft' || 
            this.options.menuposition == 'bottomleft' ? true : false;
        this._isTopPosition = this.options.menuposition == 'topleft' || 
            this.options.menuposition == 'topright' ? true : false;
        this._isHorizontal = this.options.direction == 'horizontal' ? true : false;
    },

    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-slidemenu leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', this._container);
        link.title = 'Menu';
        L.DomUtil.create('span', 'fa fa-bars', link);

        this._menu = L.DomUtil.create('div', 'leaflet-menu', map._container);

        this._menu.style.width = this.options.width;
        this._menu.style.height = this.options.height;

        if (this._isHorizontal){
            var frominit = -(parseInt(this.options.width, 10));
            if (this._isLeftPosition){
                this._menu.style.left = '-' + this.options.width;
            } else {
                this._menu.style.right = '-' + this.options.width;
            }
            if (this._isTopPosition) {
                this._menu.style.top = '0px';
            } else {
                this._menu.style.bottom = '0px';
            }
        } else {
            var frominit = -(parseInt(this.options.height, 10));
            if (this._isLeftPosition){
                this._menu.style.left = '0px';
            } else {
                this._menu.style.right = '0px';
            }
            if (this._isTopPosition) {
                this._menu.style.top = '-' + this.options.height;
            } else {
                this._menu.style.bottom = '-' + this.options.height;
            }
        }

        var closeButton = L.DomUtil.create('button', 'btn btn-primary leaflet-menu-close-button fa', this._menu);

        if (this._isHorizontal){
            if (this._isLeftPosition) {
                closeButton.style.float = 'right';
                L.DomUtil.addClass(closeButton, 'fa-chevron-left');
            }
            else {
                closeButton.style.float = 'left';
                L.DomUtil.addClass(closeButton, 'fa-chevron-right');
            }
        } else {
            if (this._isTopPosition) {
                closeButton.style.float = 'right';
                L.DomUtil.addClass(closeButton, 'fa-chevron-up');
            }
            else {
                closeButton.style.float = 'right';
                L.DomUtil.addClass(closeButton, 'fa-chevron-down');
            }
        }

        this._contents = L.DomUtil.create('div', 'leaflet-menu-contents', this._menu);

        this._contents.innerHTML = this._innerHTML+this._setLayers(group_layers);
        this._contents.style.clear = 'both';

        if (this._isHorizontal){
            var ispx = this.options.width.slice(-1) == 'x' ? true : false;
            var unit = parseInt(this.options.width, 10) * parseInt(this.options.changeperc, 10) / 100;
        } else {
            var ispx = this.options.height.slice(-1) == 'x' ? true : false;
            var unit = parseInt(this.options.height, 10) * parseInt(this.options.changeperc, 10) / 100;
        }

        L.DomEvent.disableClickPropagation(this._menu);
        L.DomEvent
            .on(link, 'click', L.DomEvent.stopPropagation)
            .on(link, 'click', function() {
                // Open
                this._animate(this._menu, frominit, 0, true, ispx, unit);
            }, this)
            .on(closeButton, 'click', L.DomEvent.stopPropagation)
            .on(closeButton, 'click', function() {
                // Close
                this._animate(this._menu, 0, frominit, false, ispx, unit);
            }, this);

        return this._container;
    },
    
    onRemove: function(map){
		//Remove sliding menu from DOM
		map._container.removeChild(this._menu);
		delete this._menu;
	},

    setContents: function(innerHTML) {
        this._innerHTML = innerHTML;
        this._contents.innerHTML = this._innerHTML;
    },

    _setLayers: function(group_layers){
    	console.log("Grupo de Camadas: ", group_layers);
    	
    	var contentsCategories = "<div id=\"accordion\" role=\"tablist\" style=\"\" aria-multiselectable=\"true\">";
    	contentsCategories += "<div class=\"panel panel-default\">";
    	$.each(group_layers.layers, function(name_group, group_layer){

    		var categoryParametized = name_group.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/(^-|-|_$)/g,'');

    		
			    contentsCategories += "<div class=\"panel-heading\" role=\"tab\" id=\"heading_"+categoryParametized+"\">";
				    contentsCategories +=  "<h4 class=\"panel-title\">";
				    contentsCategories +=    "<a data-toggle=\"collapse\" href=\"#collapse_"+categoryParametized+"\" aria-expanded=\"false\" aria-controls=\"collapse_"+categoryParametized+"\">";
				    	contentsCategories += humanize(name_group);
				    contentsCategories +=    "</a>";
				    contentsCategories +=  "</h4>";
		    	contentsCategories += "</div>";
		    contentsCategories += "<div id=\"collapse_"+categoryParametized+"\" class=\"panel-collapse collapse out\" role=\"tabpanel\" aria-labelledby=\"heading_"+categoryParametized+"\" data-parent=\"#accordion\">";
			contentsCategories += "<div class=\"panel-body\">";

				contentsCategories += "<div id=\"accordion_layers\" role=\"tablist\" style=\"\">";
				contentsCategories += "<div class=\"panel panel-default\">";
	    		$.each(group_layer, function(name_layer, layer){	    	

			        //contentsCategories += layer;
			        var layerParametized = categoryParametized+"_"+name_layer.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

			        
					    contentsCategories += "<div class=\"panel-heading\" id=\"heading_"+layerParametized+"\">";
						    contentsCategories += "<div class=\"row\">";
					        contentsCategories +=    "<div class=\"col-xs-4 text-left\"><input type=\"checkbox\" /></div>";
					        contentsCategories +=    "<div class=\"col-xs-4 text-center\">"+humanize(name_layer)+"</div>";
					        contentsCategories +=    "<div class=\"col-xs-4 text-right\">";
                                contentsCategories +=    "<a href=\"#\" data-toggle=\"collapse\" data-target=\"#collapse_"+layerParametized+"\" role=\"tab\" ><i class=\"fa fa-cogs\"></i></a>";
                            contentsCategories +=    "</div>";
					        contentsCategories += "</div>";

				           
				    	contentsCategories += "</div>";
				    contentsCategories += "<div id=\"collapse_"+layerParametized+"\" class=\"panel-collapse collapse out\" role=\"tabpanel\" aria-labelledby=\"heading_"+layerParametized+"\" data-parent=\"#accordion_layers\">";
						contentsCategories += "<div class=\"panel-body\">";
						contentsCategories += parseMetadata(layer.metadata);
						contentsCategories += "</div>"; //end of panel body
						contentsCategories += "<table class=\"table table-bordered table-condensed\">";
														
                            contentsCategories += generateConfigLayer(layer, layerParametized);

						contentsCategories += "</table>";
						
					contentsCategories += "</div>";
			        			            
	    		});
	    		contentsCategories += "</div>";	
	    		contentsCategories += "</div>";

    		contentsCategories += "</div>";
		    contentsCategories += "</div>";
	        
    		
    	});
		contentsCategories += "</div>";
    	contentsCategories += "</div>";

    	return contentsCategories;
    },

    _animate: function(menu, from, to, isOpen, ispx, unit) {
        if (this._isHorizontal){
            if (this._isLeftPosition){
                menu.style.left = from + (ispx ? 'px' : '%');
            } else {
                menu.style.right = from + (ispx ? 'px' : '%');
            }
        } else {
            if (this._isTopPosition) {
                menu.style.top = from + (ispx ? 'px' : '%');
            } else {
                menu.style.bottom = from + (ispx ? 'px' : '%');
            }
        }

        if (from != to){
            setTimeout(function(slideMenu) {
                var value = isOpen ? from + unit : from - unit;
                slideMenu._animate(slideMenu._menu, value, to, isOpen, ispx, unit);
            }, parseInt(this.options.delay), this);
        } else {
            return;
        }
    }
});

function generateConfigLayer(layer, layerParametized)
{
    var contentsCategories = "";

    if(layer.type == 'WMS')
    {
        contentsCategories += "<tr class=\"active\"><th colspan=\"6\"><b>Config. Fill</b></th></tr>";
        contentsCategories += load_opacity_control(layer, layerParametized, "fa fa-eye-slash", "fa fa-eye", 0, 1, 0.1, 1);
        
        contentsCategories += "<tr class=\"active\"><td colspan=\"6\"><b>Config. Line</b></td></tr>";
        contentsCategories += load_stroke_line_opacity_control(layer, layerParametized, "fa fa-eye-slash", "fa fa-eye", 0,1,0.1,1);
        contentsCategories += load_stroke_line_control(layer, layerParametized, "fa fa-minus-square", "fa fa-plus-square", 0, 1, 0.1, 1);
    }
    else if(layer.type == 'WFS')
    {
               
    }
    else{
        contentsCategories += "<td colspan=\"6\">No config to Layer</td>";
    }

    return contentsCategories;
}

function load_stroke_line_opacity_control(layer, layerParametized, class_first_icon, class_second_icon, min_value, max_value, step_value, pre_value){
     var contentsCategories = "";

    contentsCategories += "<tr>";
    contentsCategories += "<td style=\"width: 25px\"><b>Opacity:</b></td>";
    contentsCategories += "<td style=\"width: 5px\">";
    contentsCategories += "<i class=\""+class_first_icon+"\"></i>";
    contentsCategories += "</td>";
    contentsCategories += "<td colspan=\"3\">";
    contentsCategories += "<input type=\"text\" id=\"stroke_line_"+layerParametized+"\" name=\"stroke_line_"+layerParametized+"\"";
    contentsCategories += "data-provide=\"slider\"";
    contentsCategories += "data-slider-min=\""+min_value+"\"";
    contentsCategories += "data-slider-max=\""+max_value+"\"";
    contentsCategories += "data-slider-step=\""+step_value+"\"";
    contentsCategories += "data-slider-value=\""+pre_value+"\"";
    contentsCategories += "data-slider-tooltip=\"show\" />";
    contentsCategories += "</td>";
    contentsCategories += "<td style=\"width: 5px\">";
    contentsCategories += "<i class=\""+class_second_icon+"\"></i>";
    contentsCategories += "</td>";
    contentsCategories += "</tr>";

    return contentsCategories;
}

function load_stroke_line_control(layer, layerParametized, class_first_icon, class_second_icon, min_value, max_value, step_value, pre_value){
    var contentsCategories = "";

    contentsCategories += "<tr>";
    contentsCategories += "<td style=\"width: 25px\"><b>Stroke:</b></td>";
    contentsCategories += "<td style=\"width: 5px\">";
    contentsCategories += "<i class=\""+class_first_icon+"\"></i>";
    contentsCategories += "</td>";
    contentsCategories += "<td colspan=\"3\">";
    contentsCategories += "<input type=\"text\" id=\"stroke_line_"+layerParametized+"\" name=\"stroke_line_"+layerParametized+"\"";
    contentsCategories += "data-provide=\"slider\"";
    contentsCategories += "data-slider-min=\""+min_value+"\"";
    contentsCategories += "data-slider-max=\""+max_value+"\"";
    contentsCategories += "data-slider-step=\""+step_value+"\"";
    contentsCategories += "data-slider-value=\""+pre_value+"\"";
    contentsCategories += "data-slider-tooltip=\"show\" />";
    contentsCategories += "</td>";
    contentsCategories += "<td style=\"width: 5px\">";
    contentsCategories += "<i class=\""+class_second_icon+"\"></i>";
    contentsCategories += "</td>";
    contentsCategories += "</tr>";

    return contentsCategories;
}

function load_opacity_control(layer, layerParametized, class_first_icon, class_second_icon, min_value, max_value, step_value, pre_value)
{
    var contentsCategories = "";

    contentsCategories += "<tr>";
    contentsCategories += "<td style=\"width: 25px\"><b>Opacity:</b></td>";
    contentsCategories += "<td style=\"width: 5px\">";
    contentsCategories += "<i class=\""+class_first_icon+"\"></i>";
    contentsCategories += "</td>";
    contentsCategories += "<td colspan=\"3\">";
    contentsCategories += "<input type=\"text\" id=\"opacity_"+layerParametized+"\" name=\"opacity_"+layerParametized+"\"";
    contentsCategories += "data-provide=\"slider\"";
    contentsCategories += "data-slider-min=\""+min_value+"\"";
    contentsCategories += "data-slider-max=\""+max_value+"\"";
    contentsCategories += "data-slider-step=\""+step_value+"\"";
    contentsCategories += "data-slider-value=\""+pre_value+"\"";
    contentsCategories += "data-slider-tooltip=\"show\" />";
    contentsCategories += "</td>";
    contentsCategories += "<td style=\"width: 5px\">";
    contentsCategories += "<i class=\""+class_second_icon+"\"></i>";
    contentsCategories += "</td>";
    contentsCategories += "</tr>";

    return contentsCategories;
}

function humanize(str) {
	  return str
	      .replace(/^[\s_]+|[\s_]+$/g, '')
	      .replace(/[_\s]+/g, ' ')
	      .replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
}

function parseMetadata(metadata)
{
	var m = "<ul>";

	$.each(metadata, function(k,v){
		m+="<li><b>"+k+"</b> "+v+"</li>";
	});

	m+= "</ul>"

	return m;
}

L.control.LayersSidebar = function(innerHTML, options, layers) {
    return new L.Control.LayersSidebar(innerHTML, options, layers);
}
