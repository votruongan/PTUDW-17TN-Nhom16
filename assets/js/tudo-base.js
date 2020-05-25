// FIT - HCMUS - 1712266 - Vo Truong An - simple font-end template engine

// usage: define a template, use $+<number> to denotes index in params array
// example:
// 		t = "<div>$0</div>"
//		p = ["foo"]
//		templateImplement(t,p)
// output: <div>foo</div>

function templateImplement(template,params,isArrayOfParams=false){
	var i = 0, len = params.length,j;
	var res = []; var tmp;
	if (isArrayOfParams){
		var pArr = [];
		for (i = 0; i < len; i++){
			pArr.push(params[i][j]);
		}	
		return res;
	}
	for (i = 0; i < len; i++){
		res.push(execImplement(template,0,params[i]));
	}
	return res;
}

function deArrayToElements(arr){
	var res = []; var len = arr.length;
	var tmp,j,i,k;
	tmp = arr.splice(0);
	for (i = 0; i < len-1; i++){
		tmp = expandArray(tmp,i)
		for (j = 0; j < tmp.length; j++){
			var det = expandArray(tmp[j],i+1);
			if (det == undefined)
			{
				console.log(tmp);
				console.log(j + " - " +i);
				continue;
			}
			for (k = 0; k < det.length; k++){
				res.push(expandArray(tmp[j],i+1));
			}
		}
	}
	return res;
}

function expandArray(arr,index){
	if (!Array.isArray(arr[index]))
		return;
	var res = []; var len = arr[index].length;
	var i =0;
	for (i=0;i < len;i++){
		res.push(arr.slice(0));
		res[i][index] = arr[index][i];
	}
	return res;
}


function execImplement(template,index,str){
	tmp = "$" + index;
	return template.replace(tmp,str);
}

