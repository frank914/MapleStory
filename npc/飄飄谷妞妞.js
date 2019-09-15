var status = -1;
var Name = Array(
"黑桃A","黑桃2","黑桃3","黑桃4","黑桃5","黑桃6","黑桃7","黑桃8","黑桃9","黑桃10","黑桃J","黑桃Q","黑桃K",
"紅心A","紅心2","紅心3","紅心4","紅心5","紅心6","紅心7","紅心8","紅心9","紅心10","紅心J","紅心Q","紅心K",
"方塊A","方塊2","方塊3","方塊4","方塊5","方塊6","方塊7","方塊8","方塊9","方塊10","方塊J","方塊Q","方塊K",
"梅花A","梅花2","梅花3","梅花4","梅花5","梅花6","梅花7","梅花8","梅花9","梅花10","梅花J","梅花Q","梅花K");
var Point = Array(
1,2,3,4,5,6,7,8,9,10,100,100,100,
1,2,3,4,5,6,7,8,9,10,100,100,100,
1,2,3,4,5,6,7,8,9,10,100,100,100,
1,2,3,4,5,6,7,8,9,10,100,100,100);
var MesoBase = 100; //楓幣基礎值
var MesoMin = 100; //楓幣min
var MesoMax = 1000000; //楓幣max 
var Point1_Base = 100; //楓點基礎值
var Point1_Min = 100; //楓點min
var Point1_Max = 1000000; //楓點max 
var Point2_Base = 100; //GASH基礎值
var Point2_Min = 100; //GASHmin
var Point2_Max = 1000000; //GASHmax 
var typed ; // 選擇類別
var typedName = ["楓幣","楓點","GASH"];
var Consume ; //消費值
var Player =["無妞",0,0];
var PlayerH =Array();
var PlayerP =Array();
var Computer =["無妞",0,0];
var ComputerH =Array();
var ComputerP =Array();
var Odds = 100 ; //賠率 % 數
var ran ;
var PointVector = [
["無妞",0,0], 
["一點",1,1], 
["二點",2,1], 
["三點",3,1], 
["四點",4,1], 
["五點",5,1], 
["六點",6,1], 
["七點",7,2], 
["八點",8,2], 
["九點",9,2], 
["妞妞",10,3], 
["黑龍",11,5]
]; // 牌名,順位,倍率

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status >= 1) {
            status = 1;
            //return;
        } else {
            cm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        var text = "你好，歡迎來到#rXX谷#b#e妞妞系統#n#k\r\n";
        text += "#L0#使用楓幣賭博#l\r\n";
        text += "#L1#使用楓點賭博#l\r\n";
        text += "#L2#使用GASH賭博#l\r\n";
        cm.sendSimple(text);
    } else if (status == 1) {
        typed = selection;
        var text = "請輸入你要投注的金額：";
        if (selection == 0) {
            cm.sendGetNumber(text, MesoBase, MesoMin, MesoMax);
        } else if (selection == 1) {
            cm.sendGetNumber(text, Point1_Base, Point1_Min, Point1_Max);
        } else if (selection == 2) {
            cm.sendGetNumber(text, Point2_Base, Point2_Min, Point2_Max);
        }
    } else if (status == 2) {
		Consume = selection; 
		if ( typed == 0 ){
			if ( cm.getPlayer().getMeso() < Consume*PointVector[11][2] ){
				cm.sendOk("您的金額不足以負擔最慘的狀況欸");
				cm.dispose();
				return;
			}else
				cm.gainMeso(-Consume);
		} else if ( typed == 1 ) {
			if ( cm.getPlayer().getCSPoints(2) < Consume*PointVector[11][2] ){
				cm.sendOk("您的金額不足以負擔最慘的狀況欸");
				cm.dispose();
				return;
			}else
				cm.getPlayer().modifyCSPoints(-Consume, 2, true);
		} else if ( typed == 2 ) {
			if ( cm.getPlayer().getCSPoints(1) < Consume*PointVector[11][2] ){
				cm.sendOk("您的金額不足以負擔最慘的狀況欸");
				cm.dispose();
				return;
			}else
				cm.getPlayer().modifyCSPoints(-Consume, 1, true);
		}
		text  = "#b帥哥/美女\r\n#k";
		text += "您下注的額度是"+Consume+typedName[typed]+"\r\n\r\n";
		text += "#r#e點選下一步開自己牌";
		Licensing(); // 發牌
        cm.sendNext(text);
    } else if (status == 3) {
		Judgebrand(Player,PlayerP);
		text  = "#b帥哥/美女\r\n#k";
		text += "您下注的額度是"+Consume+typedName[typed]+"\r\n\r\n";
		text += "你目前手上的牌"+PlayerH[0]+"."+PlayerH[1]+"."+PlayerH[2]+"."+PlayerH[3]+"."+PlayerH[4]+":#b"+Player[0]+"\r\n";
		text += "#r#e點選下一步開莊家牌";
        cm.sendNext(text);
    } else if (status == 4) {
		Judgebrand(Computer,ComputerP);
		text  = "#b帥哥/美女\r\n#k";
		text += "您下注的額度是"+Consume+typedName[typed]+"\r\n\r\n";
		text += "你目前手上的牌"+PlayerH[0]+"."+PlayerH[1]+"."+PlayerH[2]+"."+PlayerH[3]+"."+PlayerH[4]+":#b"+Player[0]+"\r\n";
		text += "#k莊家目前手上的牌"+ComputerH[0]+"."+ComputerH[1]+"."+ComputerH[2]+"."+ComputerH[3]+"."+ComputerH[4]+":#b"+Computer[0]+"\r\n";
		text += "#r#e點選下一步比較點數";
        cm.sendNext(text);
    } else if (status == 5) {
		if (CompareSize( Player[1], Computer[1] )) {
			text = "你目前手上的牌"+PlayerH[0]+"."+PlayerH[1]+"."+PlayerH[2]+"."+PlayerH[3]+"."+PlayerH[4]+":#b"+Player[0]+"\r\n";
			text += "#k比莊家目前手上的牌"+ComputerH[0]+"."+ComputerH[1]+"."+ComputerH[2]+"."+ComputerH[3]+"."+ComputerH[4]+":#b"+Computer[0]+"\r\n";
			text += "#k還大，#r#e 賠率:"+Player[2]+"\r\n";
			text += "點選下一步領獎";
			cm.sendNext(text);
		} else {
			if ( typed == 0 ){
				cm.gainMeso(-Consume*(Computer[2]-1));
			} else if ( typed == 1 ) {
				cm.getPlayer().modifyCSPoints(-Consume*Computer[2], 2, true);
			} else if ( typed == 2 ) {
				cm.getPlayer().modifyCSPoints(-Consume*Computer[2], 1, true);
			}
			text = "你目前手上的牌"+PlayerH[0]+"."+PlayerH[1]+"."+PlayerH[2]+"."+PlayerH[3]+"."+PlayerH[4]+":#b"+Player[0]+"\r\n";
			text += "#k比莊家目前手上的牌"+ComputerH[0]+"."+ComputerH[1]+"."+ComputerH[2]+"."+ComputerH[3]+"."+ComputerH[4]+":#b"+Computer[0]+"\r\n";
			text += "#k還小，#r#e 賠率:"+Computer[2]+"\r\n";
			text += "已接受賠率懲罰，點選下一步離開。";
			cm.sendNext(text);
		}
		
    } else if (status == 6) {
		if (CompareSize( Player[1], Computer[1] )) {
			if ( typed == 0 ){
				cm.gainMeso(Consume*Player[2]);
			} else if ( typed == 1 ) {
				cm.getPlayer().modifyCSPoints(Consume*Player[2], 2, true);
			} else if ( typed == 2 ) {
				cm.getPlayer().modifyCSPoints(Consume*Player[2], 1, true);
			}

		}
			cm.sendOk("謝謝光臨，歡迎下次再來玩!");
		cm.dispose();
	}
}

function Licensing(){
	var finishOne = false;
	for ( var i = 0 ; i < 5 ; i++ ){
	  while ( !finishOne ){
		ran = parseInt(Math.random()*Name.length);
		finishOne = exambrand();
	  }
	  PlayerH[i] = Name[ran];
	  PlayerP[i] = Point[ran];
	finishOne = false;
	}
	for ( var i = 0 ; i < 5 ; i++ ){
	  while ( !finishOne ){
		ran = parseInt(Math.random()*Name.length);
		finishOne = exambrand();
	  }
	  ComputerH[i] = Name[ran];
	  ComputerP[i] = Point[ran];
	finishOne = false;
	}
}

function exambrand () {
	for(i=0;i<Player.length;i++){
		if(Player[i]==Name[ran])
			return false;
	}
	for(i=0;i<Computer.length;i++){
		if(Computer[i]==Name[ran])
			return false;
	}
	return true;
}

function Judgebrand(name,nameP){ // 1.2.3 1.2.4 1.2.5 2.3.4 2.3.5 3.4.5 五搭都要檢查紀錄大小
	if ( ( nameP[0]+nameP[1]+nameP[2]+nameP[3]+nameP[4] ) / 500 == 1 ) { // 黑龍
		name[0] = PointVector[UsePoint][0];
		name[1] = PointVector[UsePoint][1];
		name[2] = PointVector[UsePoint][2];
	}
	if ( ( nameP[0] + nameP[1] + nameP[2] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,3,4);
	if ( ( nameP[0] + nameP[1] + nameP[3] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,2,4);
	if ( ( nameP[0] + nameP[1] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,2,3);
	if ( ( nameP[0] + nameP[2] + nameP[3] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,1,4);
	if ( ( nameP[0] + nameP[2] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,1,3);
	if ( ( nameP[0] + nameP[3] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,1,2);
	if ( ( nameP[1] + nameP[2] + nameP[3] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,4);
	if ( ( nameP[1] + nameP[2] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,3);
	if ( ( nameP[1] + nameP[3] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,2);
	if ( ( nameP[2] + nameP[3] + nameP[4] ) % 10 == 0 ) 
		Judgebrand2(name,nameP,0,1);
	

}
function Judgebrand2(name,nameP,first,second){
  	UsePoint = nameP[first] + nameP[second];
	UsePoint = UsePoint % 10;
	if ( UsePoint == 0 )
		UsePoint += 10;
	if ( name[1] <= PointVector[UsePoint][1] ){
		name[0] = PointVector[UsePoint][0];
		name[1] = PointVector[UsePoint][1];
		name[2] = PointVector[UsePoint][2];
	}
	
	
}

function CompareSize( PlayerSize, ComputerSize ) { // 玩家大電腦 RETURN TRUE
	if ( Player > ComputerSize )
		return true;
	else
		return false;
}