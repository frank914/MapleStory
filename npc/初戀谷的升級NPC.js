var rewardItem = -1 ,reqItemQty = -1, reqEqp = -1, SuccessRand = -1, ExplosionRand = -1;
var status = 0;
var reqItem = 4001523;
var reqPoint =10000; //升階需求楓點
var items = [
[1132243,2000,-1,100,0,false], 
[1122264,2000,-1,100,0,false],
[1032220,3000,-1,100,0,false],
[1113072,3000,-1,100,0,false],

[1132244,1500,1132243,70,0],
[1122265,1500,1122264,70,0],
[1032221,1500,1032220,70,0],
[1113073,1500,1113072,70,0],

[1132245,2000,1132244,50,20],
[1122266,2000,1122265,50,20],
[1032222,2000,1032221,50,20],
[1113074,2000,1113073,50,20],

[1132246,3000,1132245,30,30],
[1122267,3000,1122266,30,30],
[1032223,3000,1032222,30,30],
[1113075,3000,1113074,30,30]

] ; // 獲得物, 需要楓葉, 需求物, 成功率 破壞率
function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++
    } else if (mode == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status <= 0) {
	cm.sendOk("謝謝光臨，歡迎下次再來~");
	cm.dispose();
    }
    if (status == 1) {
	var msg = "";
	msg += "您好我是8月活動NPC，活動物品全域掉落哦~，我們提供的兌換有\r\n";
	for ( i = 0; i < items.length ; i++ ) {
		rewardItem = items[i][0];
		reqItemQty = items[i][1];
		reqEqp = items[i][2]; 
		SuccessRand = items[i][3];
		ExplosionRand = items[i][4];
		msg += "\r\n#L"+i+"#用"+reqItemQty+"個#i"+reqItem+":#兌換#i" + rewardItem  +":#成功率:"+SuccessRand+" 破壞率:"+ExplosionRand+"\r\n" ;
		if ( reqEqp >= 0 )
			msg += "\t額外需求裝備:#i"+reqEqp+":##t"+reqEqp+":#\r\n\t並且需要:"+reqPoint+"楓葉點數\r\n"
	}
	cm.sendSimple(msg);
    }else if ( status == 2 ) {
	sel = selection;
	rewardItem = items[sel][0];
	reqItemQty = items[sel][1];
	reqEqp = items[sel][2]; 
	SuccessRand = items[sel][3];
	ExplosionRand = items[sel][4];
	if ( !cm.hasSpace(rewardItem,1) ) {
		cm.sendNext("哀呀，看來你的裝備欄沒有空間欸~");
		cm.dispose();
		return;
	} else if ( !cm.haveItem(reqItem,reqItemQty) ) {
		cm.sendOk("所有的#i"+reqItem+":#不足到"+reqItemQty+"個");
		cm.dispose();
		return;
	} else if ( reqEqp > 0 && !cm.haveItem(reqEqp,1) ) {
		cm.sendOk("你好像沒有#i"+reqEqp+":##t"+reqEqp+":#欸，檢查看看!");
		cm.dispose();
		return;
	} else if (cm.getPlayer().getCSPoints(2) < reqPoint && reqEqp > 0) {
		cm.sendOk("點數不足需要"+reqPoint);
		cm.dispose();
		return;
	}
		msg = "\r\n請問你是否要用"+reqItemQty+"個#i"+reqItem+":#兌換#i" + rewardItem  +":#\r\n成功率:"+SuccessRand+" 破壞率:"+ExplosionRand+"\r\n" ;
		if ( reqEqp >= 0 )
			msg += "額外需求裝備:#i"+reqEqp+":##t"+reqEqp+":#\r\n並且需要:"+reqPoint+"楓葉點數\r\n"
	cm.sendYesNo(msg);
    } else if ( status == 3 ) {
	var Rand = getRandomInt(1,100) ;
	var Rand_ExPlosion = getRandomInt(1,100) ;
	cm.gainItem(reqItem,-reqItemQty);
	if ( reqEqp > 0 ){
		cm.getPlayer().modifyCSPoints(2, -reqPoint, true);
		cm.gainItem(reqEqp, -1);
	}
	if ( Rand <= SuccessRand ){
			cm.gainItem(rewardItem, 1);
			cm.sendOk("合成成功，檢查看看背包吧");
	} else {
		if ( Rand_ExPlosion <= ExplosionRand && reqEqp > 0){
			cm.gainItem(reqEqp, -1);
			cm.sendOk("合成失敗，而且連#i"+reqEqp+":##t"+reqEqp+":#也跟著爆炸了!!");
		} else 
			cm.sendOk("哀呀，合成失敗了!!");
    }
	cm.dispose();
	}
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}