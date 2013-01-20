/*
	the namespace object
*/
var autosave_js = autosave_js || {
	options : {
		defaultSaveTime : 10000
	},
	t : 0,
	Items : [],
	localStorageName : "ats-js"
};
/*
	a simple "enum" type
*/
autosave_js.ItemType = { 
	Input : 'input',
	Textarea : 'textarea'
}

/*
* the entities used
*/
autosave_js.Item = function(guid,id,name,value,type,url){
	this.Guid = guid;
	this.Id = id;
	this.Name = name;
	this.Value = value;
	this.Type = type;
	this.Key = url+'|'+id+'|'+name;
}
autosave_js.Site = function(url){
	this.Url = url;
	this.Items = [];
}
/*
	guid/uid generator
	code found at http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
*/
autosave_js.GenerateId = function(){
	var S4 = function (){
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };
    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
}

/*
	scan the markup and load the items
*/
autosave_js.loadItems = function(){

	var selection = $('input[type="text"],textarea');
	$.each(selection,function(index,element){
		var self = $(element);
		var nodeName = self.prop('nodeName').toLowerCase();
		var guid = autosave_js.GenerateId();
		var newItem = new autosave_js.Item(guid,self.prop('id'),self.prop('name'),self.val(),nodeName,document.location.href);
		
		//add the items array
		autosave_js.Items.push(newItem);
		
		//decorate the html tags
		self.attr('autosave-guid',guid);
	});
}

autosave_js.save = function(){
	if(autosave_js.Items !== null){
		var cache = autosave_js.Items;
		var str = '[';
		for(var i=0;i<cache.length;i++)
		{
			var newVal = $('[autosave-guid="'+cache[i].Guid+'"]').val();
			cache[i].Value = newVal;
			
			if(i===0)
			{
				str += '{"k":"'+cache[i].Key+'","v":"'+cache[i].Value+'"}'; 
			}
			else
			{
				str += ',{"k":"'+cache[i].Key+'","v":"'+cache[i].Value+'"}'
			}
			str += ']';
		}
		
		localStorage.setItem(autosave_js.localStorageName,str);
	}
	
	// console.log('..saved...');
	// autosave_js.debug();
}

autosave_js.debug = function(){
	var cache = autosave_js.Items;
	for(var i=0;i<cache.length;i++)
	{
		var str = cache[i].Guid+'='+cache[i].Value;
		console.log(str);
	}
}

/*
	check for requirements
*/
autosave_js.checkDependencies = function(){
		if(!localStorage)
		{
			throw new Exception('An error ocured : autosave.js needs a browser that supports localStorage.');
		};
		
		if(!window.jQuery)
		{
			throw new Exception('An error ocured : autosave.js needs jQuery enabled.');
		}
}

/*
	main function
*/
autosave_js.StartAutoSave = function(){
	try
	{
		autosave_js.checkDependencies();
		autosave_js.loadItems();
		autosave_js.t = setInterval('autosave_js.save()',autosave_js.options.defaultSaveTime);
	}
	catch(e)
	{
		console.log(e);
	}
}

/*
	fireStarter!
*/
$(function(){
	autosave_js.StartAutoSave();
});
