/**
 * Progetto di diploma: Dynamic web based dashboard
 * Created by Rezart Lohja - 2017.
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

            $.ajax({url: EGI.json}).done(function( data ) {
                EGI.data=data;
                if(EGI.filters){
                    $.each(EGI.filters,function(i,v){
                        if(EasyGraphFilter.hasOwnProperty(v))EGI.data = EasyGraphFilter[v](EGI.data);
                        else console.error('Filter "' + v + '" does not exist.');
                    });
                }

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
            case 'line':
                return new EasyGraphDrawLine(EasyGraphItem);
                break;
            case 'radar':
                return new EasyGraphDrawRadar(EasyGraphItem);
                break;
            case 'doughnut':
                return new EasyGraphDrawDoughnut(EasyGraphItem);
                break;
            case 'polarArea':
                return new EasyGraphDrawPolarArea(EasyGraphItem);
                break;
            case 'pie':
                return new EasyGraphDrawPie(EasyGraphItem);
                break;
            case 'bubble':
                return new EasyGraphDrawBubble(EasyGraphItem);
                break;
            case 'scatter':
                return new EasyGraphDrawScatter(EasyGraphItem);
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
        if(this.check()){
            new Chart(this.easy_graph_item.context, {
                type: this.easy_graph_item.type,
                data: this.easy_graph_item.data,
                options: this.easy_graph_item.options
            });
        }else{
            console.error("Data structure not correct for "+this.easy_graph_item.type+" chart.");
        }
    }
}

class EasyGraphDrawBar extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
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
class EasyGraphDrawLine extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
    }

    check(){
        console.log(this.easy_graph_item);
        if(!this.easy_graph_item.data.hasOwnProperty('datasets')) return false;
        var EGDL=this;
        $.each(this.easy_graph_item.data['datasets'],function(ind,dataset){
            if(!dataset["data"][0].hasOwnProperty("x")){
                if(!EGDL.easy_graph_item.data.hasOwnProperty('labels')) return false;
            }else{
                if(!dataset["data"][0].hasOwnProperty("y")) return false;
            }
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
            if(!output_data["datasets"][ind].hasOwnProperty("fill"))
                output_data["datasets"][ind]["fill"] = false;
        });
        return output_data;
    }
}
class EasyGraphDrawRadar extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
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
class EasyGraphDrawDoughnut extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
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
            $.each(dataset['data'],function(ind2,d) {
                var rgb = EasyGraph.getRandomColorRGB();
                if (!output_data["datasets"][ind].hasOwnProperty("backgroundColor")) output_data["datasets"][ind]["backgroundColor"]=[];
                output_data["datasets"][ind]["backgroundColor"][ind2] = "rgba(" + rgb + ")";
            });
        });
        return output_data;
    }
}
class EasyGraphDrawPie extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
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
            $.each(dataset['data'],function(ind2,d) {
                var rgb = EasyGraph.getRandomColorRGB();
                if (!output_data["datasets"][ind].hasOwnProperty("backgroundColor")) output_data["datasets"][ind]["backgroundColor"]=[];
                output_data["datasets"][ind]["backgroundColor"][ind2] = "rgba(" + rgb + ")";
            });
        });
        return output_data;
    }
}
class EasyGraphDrawPolarArea extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
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
            $.each(dataset['data'],function(ind2,d) {
                var rgb = EasyGraph.getRandomColorRGB();
                if (!output_data["datasets"][ind].hasOwnProperty("backgroundColor")) output_data["datasets"][ind]["backgroundColor"]=[];
                output_data["datasets"][ind]["backgroundColor"][ind2] = "rgba(" + rgb + ")";
            });
        });
        return output_data;
    }
}
class EasyGraphDrawBubble extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
    }

    check(){
        if(!this.easy_graph_item.data.hasOwnProperty('datasets')) return false;
        $.each(this.easy_graph_item.data['datasets'],function(ind,dataset){
            if(!dataset.hasOwnProperty("label")) return false;
            if(!dataset.hasOwnProperty("data")) return false;
            if(!dataset['data'][0].hasOwnProperty("x")) return false;
            if(!dataset['data'][0].hasOwnProperty("y")) return false;
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
class EasyGraphDrawScatter extends EasyGraphDraw{
    constructor(easy_graph_item){
        super(easy_graph_item);
    }

    check(){
        if(!this.easy_graph_item.data.hasOwnProperty('datasets')) return false;
        $.each(this.easy_graph_item.data['datasets'],function(ind,dataset){
            if(!dataset.hasOwnProperty("label")) return false;
            if(!dataset.hasOwnProperty("data")) return false;
            if(!dataset['data'][0].hasOwnProperty("x")) return false;
            if(!dataset['data'][0].hasOwnProperty("y")) return false;
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

class EasyGraphFilter{
    static frequencyDistribution(data){
        var dataset = {};
        $.each(data,function(ind,val){
            if(!(val in dataset)) dataset[val]=0;
            dataset[val]++;
        });
        var output_data={
            "labels":[],
            "datasets": [
                {
                    "data": []
                }
            ]
        };
        $.each(dataset,function(ind,val){
            output_data["labels"].push(ind);
            output_data["datasets"][0]["data"].push(val);
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

// esempio di aggiunta di un filtro
EasyGraphFilter.myNewFilter = function (data){console.log('myNewFilter');return data;}
