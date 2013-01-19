/*
	the namespace object
*/
var autosave_js = autosave_js || {
	options : {
		defaultSaveTime : 10000
	},
	theSite : {}
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
autosave_js.Item = function(guid,id,name,value,type){
	this.Guid = guid;
	this.Id = id;
	this.Name = name;
	this.Value = value;
	this.Type = type;
}
autosave_js.Site = function(url){
	this.Url = url;
	this.Items = [];
	
	//check if site alreay is in the local db
	//and add the items to the in memory
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
	var theSite = new autosave_js.Site(document.location.href);

	var selection = $('input[type="text"],textarea');
	$.each(selection,function(index,element){
		var self = $(element);
		var nodeName = self.prop('nodeName').toLowerCase();
		var guid = autosave_js.GenerateId();
		var newItem = new autosave_js.Item(guid,self.prop('id'),self.prop('name'),self.val(),nodeName);
		
		//add the items array
		theSite.Items.push(newItem);
		
		//decorate the html tags
		self.attr('autosave-guid',guid);
	});
	autosave_js.theSite = theSite;
}


autosave_js.StartAutoSave = function(){
	//load the items
	autosave_js.loadItems();
	
	//startTimer
}
