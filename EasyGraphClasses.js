/**
 * Created by Rezart Lohja on 2017.
 */


class EasyGraph{
    static load(){
        var graphs = $("easygraph");
        graphs.each(function(){
            var EGI = new EasyGraphItem();
            EGI.type=this.getAttribute('charttype');
            EGI.json=this.getAttribute('json');
            EGI.filters=this.getAttribute('filters');




            var mycanvas= document.createElement('canvas');
            var id = 'canvas'+this.getAttribute('id');
            mycanvas.setAttribute('id',id);
            this.replaceWith(mycanvas);

            EGI.context=mycanvas.getContext('2d');

            $.getJSON( EGI.json, function( data ) {
                EGI.data=data;
                // if(filters){
                //     $.each(filters,function(i,v){
                //         if(EasyGraph.filter.hasOwnProperty(v))data = EasyGraph.filter[v](data);
                //         else console.error('Filter "' + v + '" does not exist.');
                //     });
                // }

                if(EGI.data.hasOwnProperty('data')){
                    if(EGI.data.hasOwnProperty('options')) EGI.options = EGI.data['options'];
                    EGI.data = EGI.data['data'];
                }
                var EGD = EasyGraphFactory.getDrawObject(EGI);
                console.log(EGD);
                if(EGD) EGD.draw();
            }) .fail(function( jqxhr, textStatus, error ){
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
        });
    }
    static getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    static getRandomColorRGB(){
        var r = EasyGraph.getRandomArbitrary(0,255);
        var g = EasyGraph.getRandomArbitrary(0,255);
        var b = EasyGraph.getRandomArbitrary(0,255);
        return r+", "+g+", "+b+", 0.6";
    }
}

class EasyGraphFactory{
    /**
     *
     * @param EasyGraphItem
     * @returns {*}
     */
    static getDrawObject(EasyGraphItem){
        console.log(EasyGraphItem.type);
        switch(EasyGraphItem.type){
            case 'bar':
                return new EasyGraphDrawBar(EasyGraphItem);
                break;
            default: console.error('Chart type "'+ EasyGraphItem.type +'" does not exist');
                return false;
        }
    }
}

class EasyGraphDraw{
    constructor(easy_graph_item){
        this.easy_graph_item = easy_graph_item;
    }

    draw(){
        new Chart(this.easy_graph_item.context, {
            type: this.easy_graph_item.type,
            data: this.easy_graph_item.data,
            options: this.easy_graph_item.options
        });
    }
}

class EasyGraphDrawBar extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
    }

    draw(){
        if(this.check()){
            super.draw();
        }else{
            console.error("Data structure not correct for Bar chart.");
        }
    }

    check(){
        if(!this.easy_graph_item.data.hasOwnProperty('labels')) return false;
        if(!this.easy_graph_item.data.hasOwnProperty('datasets')) return false;
        $.each(this.easy_graph_item.data['datasets'],function(ind,dataset){
            if(!dataset.hasOwnProperty("data")) return false;
        });
        var output_data = this.easy_graph_item.data;
        // set default colors
        $.each(this.easy_graph_item.data['datasets'],function(ind,dataset){
            var rgb = EasyGraph.getRandomColorRGB();
            if(!output_data["datasets"][ind].hasOwnProperty("backgroundColor"))
                output_data["datasets"][ind]["backgroundColor"] = "rgba("+rgb+")";
            if(!output_data["datasets"][ind].hasOwnProperty("borderColor"))
                output_data["datasets"][ind]["borderColor"] = "rgba("+rgb+")";
            if(!output_data["datasets"][ind].hasOwnProperty("borderWidth"))
                output_data["datasets"][ind]["borderWidth"] = 1;
        });
        return output_data;
    }
}

class EasyGraphItem{
    constructor(){
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get json() {
        return this._json;
    }

    set json(value) {
        this._json = value;
    }

    get filters() {
        return this._filters;
    }

    set filters(value) {
        if(value) this._filters = value.split(',');
    }

    get context() {
        return this._context;
    }

    set context(value) {
        this._context = value;
    }
    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }
}

$( document ).ready(function() {
    EasyGraph.load();
});
