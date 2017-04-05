// count functions: count_XY
// X = fg, Y = band
function count_xt(x,collection,fg,freq_lower,freq_higher) {
	return collection.find({
		["fg."+fg]: x,
		"thir.method": "B3LYP/6-31G*",
		"thir.freqs": {
			$elemMatch: {
				freq: {
					$gt: freq_lower,
					$lt: freq_higher
				}
			}
		}
	}).hint("thir_method").count();
}
function count_xx(x,collection,fg) {
	return collection.find({
		["fg."+fg]: x,
		"thir.method": "B3LYP/6-31G*"
	}).hint("thir_method").count();
}
function count_tt(collection,fg,freq_lower,freq_higher) {
	return count_xt(true,collection,fg,freq_lower,freq_higher);
}
function count_ft(collection,fg,freq_lower,freq_higher) {
	return count_xt(false,collection,fg,freq_lower,freq_higher);
}
function count_tx(collection,fg) {
	return count_xx(true,collection,fg);
}
function count_fx(collection,fg) {
	return count_xx(false,collection,fg);
}

// source: http://www2.ups.edu/faculty/hanson/Spectroscopy/IR/IRfrequencies.html
var raw_fg_info = [
	{ name:"O-H stretch,H-bonded", fg:"alchohl",lower:3200, upper:3600 },
	{ name:"O-H stretch,free", fg:"alchohl",lower:3500, upper:3700 },
	{ name:"C-O stretch,free", fg:"alchohl",lower:1050, upper:1150 },

	{ name:"C-H stretch", fg:"alkane",lower:2850, upper:3000 },
	{ name:"-C-H bending", fg:"alkane",lower:1350, upper:1480 },

	{ name:"=C-H stretch", fg:"alkene",lower:3010, upper:3100 },
	{ name:"=C-H bending", fg:"alkene",lower:675, upper:1000 },
	{ name:"C=C stretch", fg:"alkene",lower:1620, upper:1680 },

	{ name:"C-F stretch", fg:"CF",lower:1000, upper:1400 },
	{ name:"C-Cl stretch", fg:"CCl",lower:600, upper:800 },
	{ name:"C-Br stretch", fg:"CBr",lower:500, upper:600 },
	{ name:"C-I stretch", fg:"CI",lower:450, upper:550 }, // in source it is 500

	{ name:"C-H stretch", fg:"alkyne",lower:3250, upper:3350 }, // in source 3300
	{ name:"-C=-C- stretch", fg:"alkyne",lower:2100, upper:2260 },

	{ name:"N-H stretch", fg:"amine",lower:3300, upper:3500 },
	{ name:"C-N stretch", fg:"amine",lower:1080, upper:1360 },
	{ name:"N-H bending", fg:"amine",lower:1550, upper:1650 }, // in source 1600

	{ name:"C-H stretch", fg:"aromatic",lower:3000, upper:3100 },
	{ name:"C=C stretch", fg:"aromatic",lower:1400, upper:1600 },

	{ name:"C-O stretch", fg:"ether",lower:1000, upper:1300 },

	{ name:"CN stretch", fg:"nitrile",lower:2210, upper:2260 },

	{ name:"N-O stretch", fg:"nitro",lower:1515, upper:1560 },
	{ name:"N-O stretch", fg:"nitro",lower:1345, upper:1385 },

	// Functional Groups Containing a Carbonyl (C=O)
	{ name:"C=O stretch", fg:"carbonyl",lower:1670, upper:1820 },

	{ name:"C=O stretch", fg:"acid",lower:1700, upper:1725 },
	{ name:"O-H stretch", fg:"acid",lower:2500, upper:3300 },
	{ name:"C-O stretch", fg:"acid",lower:1210, upper:1320 },

	{ name:"C=O stretch", fg:"aldehyde",lower:1720, upper:1740 },
	{ name:"=C-H stretch", fg:"aldehyde",lower:2820, upper:2850 },
	{ name:"=C-H stretch", fg:"aldehyde",lower:2720, upper:2750 },

	{ name:"C=O stretch", fg:"amide",lower:1640, upper:1690 },
	{ name:"N-H stretch", fg:"amide",lower:3100, upper:3500 },
	{ name:"N-H bending", fg:"amide",lower:1550, upper:1640 },

	{ name:"C=O stretch", fg:"anhydride",lower:1800, upper:1830 },
	{ name:"C=O stretch", fg:"anhydride",lower:1740, upper:1775 },

	{ name:"C=O stretch", fg:"ester",lower:1735, upper:1750 },
	{ name:"C-O stretch", fg:"ester",lower:1000, upper:1300 }

	// ketone is complicated, we will not do it here
];

var scaling = 0.96;

var len = raw_fg_info.length;
use irms
var collection = db.universe
for(var i=0;i<len;i++) {
	json = raw_fg_info[i];
	name = json["name"];
	fg = json["fg"];
	lower = json["lower"];
	upper = json["upper"];
	tt = count_tt(collection,fg,lower/scaling,upper/scaling);
	tf = count_tx(collection,fg) - tt;
	ft = count_ft(collection,fg,lower/scaling,upper/scaling);
	ff = count_fx(collection,fg) - ft;
	print(name,fg,lower,upper,tt,tf,ft,ff)
}
