/**
 * Created by Rezart Lohja on 2017.
 */
$( document ).ready(function() {
    EasyGraph.load();
});


var EasyGraph = {
    /**
     * Loader of the graph elements in the page
     */
    'load': function (){
        graphs = $("easygraph");
        graphs.each(function(){
            var chart_type= this.getAttribute('charttype');
            var json_url = this.getAttribute('json');

            var filters = this.getAttribute('filters');
            if(filters) filters = filters.split(',');

            var mycanvas= document.createElement('canvas');
            var id = 'canvas'+this.getAttribute('id');
            mycanvas.setAttribute('id',id);
            this.replaceWith(mycanvas);

            var context = mycanvas.getContext('2d');

            $.getJSON( json_url, function( data ) {
                if(filters){
                    $.each(filters,function(i,v){
                        if(EasyGraph.filter.hasOwnProperty(v))data = EasyGraph.filter[v](data);
                        else console.error('Filter "' + v + '" does not exist.');
                    });
                }

                if(data.hasOwnProperty('data')){
                    if(data.hasOwnProperty('options')) var options = data['options'];
                    data = data['data'];
                }
                if(EasyGraph.draw.hasOwnProperty(chart_type)) EasyGraph.draw[chart_type](context, data, options);
                else console.error('Graph type "' + chart_type + '" does not exist.');

            }) .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
        });
    },
    /**
     * Draw functions
     */
    'draw': {
        /**
         * Draw a bar graph
         * @param ctx
         * @param data
         */
        'bar': function (ctx, data, options) {
            if(EasyGraph.check.bar(data)){
                EasyGraph.draw.draw('bar',ctx, data, options);
            }else{
                console.error("Data structure not correct for Bar chart.");
            }
        },
        'line': function (ctx, data, options) {
            if(EasyGraph.check.line(data)){
                EasyGraph.draw.draw('line',ctx, data, options);
            }else{
                console.error("Data structure not correct for line chart.");
            }
        },
        'radar': function (ctx, data, options) {
            if(EasyGraph.check.radar(data)){
                EasyGraph.draw.draw('radar',ctx, data, options);
            }else{
                console.error("Data structure not correct for radar chart.");
            }
        },
        'doughnut': function (ctx, data, options) {
            if(EasyGraph.check.doughnut(data)){
                EasyGraph.draw.draw('doughnut',ctx, data, options);
            }else{
                console.error("Data structure not correct for doughnut chart.");
            }
        },
        'pie': function (ctx, data, options) {
            if(EasyGraph.check.pie(data)){
                EasyGraph.draw.draw('pie',ctx, data, options);
            }else{
                console.error("Data structure not correct for pie chart.");
            }
        },
        'polarArea': function (ctx, data, options) {
            if(EasyGraph.check.polarArea(data)){
                EasyGraph.draw.draw('polarArea',ctx, data, options);
            }else{
                console.error("Data structure not correct for polarArea chart.");
            }
        },
        'bubble': function (ctx, data, options) {
            if(EasyGraph.check.bubble(data)){
                EasyGraph.draw.draw('bubble',ctx, data, options);
            }else{
                console.error("Data structure not correct for bubble chart.");
            }
        },

        'scatter': function (ctx, data, options) {
            if(EasyGraph.check.scatter(data)){
                EasyGraph.draw.draw('scatter',ctx, data, options);
            }else{
                console.error("Data structure not correct for scatter chart.");
            }
        },
        'draw':function (type, ctx, data, options){
            console.log(type, ctx, data, options);
            new Chart(ctx, {
                type: type,
                data: data,
                options: options
            });
        }
    },
    'filter':{
        'frequencyDistribution' : function(data){
            dataset = {};
            $.each(data,function(ind,val){
                if(!(val in dataset)) dataset[val]=0;
                dataset[val]++;
            });
            output_data={
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
    },
    /**
     * data input check structure
     */
    'check' : {
        'bar': function (data) {
            if(!data.hasOwnProperty('labels')) return false;
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("data")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                var rgb = EasyGraph.utility.getRandomColorRGB();
                if(!output_data["datasets"][ind].hasOwnProperty("backgroundColor"))
                    output_data["datasets"][ind]["backgroundColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderColor"))
                    output_data["datasets"][ind]["borderColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderWidth"))
                    output_data["datasets"][ind]["borderWidth"] = 1;
            });
            return output_data;
        },
        'line': function (data) {
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset["data"][0].hasOwnProperty("x")){
                    if(!data.hasOwnProperty('labels')) return false;
                }else{
                    if(!dataset["data"][0].hasOwnProperty("y")) return false;
                }
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                var rgb = EasyGraph.utility.getRandomColorRGB();
                if(!output_data["datasets"][ind].hasOwnProperty("backgroundColor"))
                    output_data["datasets"][ind]["backgroundColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderColor"))
                    output_data["datasets"][ind]["borderColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderWidth"))
                    output_data["datasets"][ind]["borderWidth"] = 1;
            });
            return output_data;
        },
        'radar': function (data) {
            if(!data.hasOwnProperty('labels')) return false;
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("data")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                var rgb = EasyGraph.utility.getRandomColorRGB();
                if(!output_data["datasets"][ind].hasOwnProperty("backgroundColor"))
                    output_data["datasets"][ind]["backgroundColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderColor"))
                    output_data["datasets"][ind]["borderColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderWidth"))
                    output_data["datasets"][ind]["borderWidth"] = 1;
            });
            return output_data;
        },
        'doughnut': function (data) {
            if(!data.hasOwnProperty('labels')) return false;
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("data")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                $.each(dataset['data'],function(ind2,d) {
                    var rgb = EasyGraph.utility.getRandomColorRGB();
                    if (!output_data["datasets"][ind].hasOwnProperty("backgroundColor")) output_data["datasets"][ind]["backgroundColor"]=[];
                    output_data["datasets"][ind]["backgroundColor"][ind2] = "rgba(" + rgb + ")";
                });
            });
            return output_data;
        },
        'pie': function (data) {
            if(!data.hasOwnProperty('labels')) return false;
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("data")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                $.each(dataset['data'],function(ind2,d) {
                    var rgb = EasyGraph.utility.getRandomColorRGB();
                    if (!output_data["datasets"][ind].hasOwnProperty("backgroundColor")) output_data["datasets"][ind]["backgroundColor"]=[];
                    output_data["datasets"][ind]["backgroundColor"][ind2] = "rgba(" + rgb + ")";
                });
            });
            return output_data;
        },
        'polarArea': function (data) {
            if(!data.hasOwnProperty('labels')) return false;
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("data")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                $.each(dataset['data'],function(ind2,d) {
                    var rgb = EasyGraph.utility.getRandomColorRGB();
                    if (!output_data["datasets"][ind].hasOwnProperty("backgroundColor")) output_data["datasets"][ind]["backgroundColor"]=[];
                    output_data["datasets"][ind]["backgroundColor"][ind2] = "rgba(" + rgb + ")";
                });
            });
            return output_data;
        },
        'bubble': function (data) {
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("label")) return false;
                if(!dataset.hasOwnProperty("data")) return false;
                if(!dataset['data'][0].hasOwnProperty("x")) return false;
                if(!dataset['data'][0].hasOwnProperty("y")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                var rgb = EasyGraph.utility.getRandomColorRGB();
                if(!output_data["datasets"][ind].hasOwnProperty("backgroundColor"))
                    output_data["datasets"][ind]["backgroundColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderColor"))
                    output_data["datasets"][ind]["borderColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderWidth"))
                    output_data["datasets"][ind]["borderWidth"] = 1;
            });
            return output_data;
        },
        'scatter': function (data) {
            if(!data.hasOwnProperty('datasets')) return false;
            $.each(data['datasets'],function(ind,dataset){
                if(!dataset.hasOwnProperty("label")) return false;
                if(!dataset.hasOwnProperty("data")) return false;
                if(!dataset['data'][0].hasOwnProperty("x")) return false;
                if(!dataset['data'][0].hasOwnProperty("y")) return false;
            });
            var output_data = data;
            // set default colors
            $.each(data['datasets'],function(ind,dataset){
                var rgb = EasyGraph.utility.getRandomColorRGB();
                if(!output_data["datasets"][ind].hasOwnProperty("backgroundColor"))
                    output_data["datasets"][ind]["backgroundColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderColor"))
                    output_data["datasets"][ind]["borderColor"] = "rgba("+rgb+")";
                if(!output_data["datasets"][ind].hasOwnProperty("borderWidth"))
                    output_data["datasets"][ind]["borderWidth"] = 1;
            });
            return output_data;
        }
    },
    'utility':{
        'getRandomArbitrary' : function(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        'getRandomColorRGB' : function(){
            var r = EasyGraph.utility.getRandomArbitrary(0,255);
            var g = EasyGraph.utility.getRandomArbitrary(0,255);
            var b = EasyGraph.utility.getRandomArbitrary(0,255);
            return r+", "+g+", "+b+", 0.6";
        }
    }
}

// esempio di aggiunta di un filtro
EasyGraph.filter.myNewFilter = function (data){console.log('myNewFilter');return data;}

