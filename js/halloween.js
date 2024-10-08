
// 預先載入彈出音訊功能----------------------------------
let hasPreloadAudio = false;
function preloadAudio(){
    if (!hasPreloadAudio) {
        startRollAudio.muted = true;
        startRollAudio.play();

        leverPullAudio.muted = true;
        leverPullAudio.play();

        rollPlayAudio.muted = true;
        rollPlayAudio.play();

        rollStopAudio.muted = true;
        rollStopAudio.play();

        alarmAudio.muted = true;
        alarmAudio.play();

        popWinAudio.muted = true;
        popWinAudio.play();

        laughAudio.muted = true;
        laughAudio.play();

        console.log('preloaded');
        
        hasPreloadAudio = true;
    }
}

//---------------------------------
var isEventEnabled = 'true'; // var isEventEnabled = '{$eventEnabled}';
let ifLogin = (isEventEnabled == 'true');

//---------------------------------
// var leftDrawAmount = parseInt('{$lotteryAmount}'); <- 當後端準備好時，取消註解此行並刪除具有相同變數的 set static 變數
let leftDrawAmount = 1;
leftDrawAmount = isNaN(Number(leftDrawAmount)) || leftDrawAmount === null ? 0 : Number(leftDrawAmount);

// 更新繪製計數顯示的功能-------------------------------
let noMoreDrawChances = false;
const slotCountSpan = document.getElementById('slotCountSpan');
function updateslotCountSpanNumber() {
    if(slotCountSpan) slotCountSpan.textContent = leftDrawAmount;
    if (leftDrawAmount == 0) noMoreDrawChances = true;
}
updateslotCountSpanNumber();

//背景音樂功能------------------------------------
const bgAudio = new Audio('music/bg.mp3');
bgAudio.load;
bgAudio.volume = 0.5;
bgAudio.loop = true;

let isPlaying = false;
function toggleAudio() {
    if (isPlaying) {
        backgroundMusic.classList.add('musicMuted');
        isPlaying = false; 
        bgAudio.pause();
    } else {
        backgroundMusic.classList.remove('musicMuted');
        isPlaying = true; 
        bgAudio.play();
    }
}

// 生成為老虎機動畫創建隨機 icos-------------------------------------
function getRandomIcon() {
    const icons = [ '8888', '1688', '888', '588', '188','58'];
    return icons[Math.floor(Math.random() * icons.length)];
}

// 生成 3 個老虎機捲軸-------------------------------
let slotItemCount = 16;
function generateSlotMachine() {
    const machineCon = document.getElementById('slotMachine');
    const threeReel = document.createElement('div');
    threeReel.className = 'threeReelSlots';
    threeReel.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        threeReel.innerHTML += `
            <div class="reels">
                <ul class="reelsInner">
                    <li class="slot item" style="background-image: url(images/game/${getRandomIcon()}.png);"></li>
                </div>
            </ul>`;
    }
    machineCon.appendChild(threeReel);

    // setting of height and keyframes slot spinning
    const reelsInnerHeight = threeReel.clientHeight * slotItemCount;
    const reelsInnerTop = reelsInnerHeight - threeReel.clientHeight;

    $('.slot').css('height', threeReel.clientHeight);
    $('.reelsInner').css({
        'height': reelsInnerHeight,
        'top': '-' + reelsInnerTop + 'px'
    });

    const spinKeyFrames = document.createElement('style');
    spinKeyFrames.textContent = `
        @keyframes spin {
            0% { top: -${reelsInnerTop}px; }
            92% { top: 50px; }
            100% { top: 0px; }
        }`;
    document.head.appendChild(spinKeyFrames);
}
generateSlotMachine();

// 在老虎機的每個捲軸上創建 16 個隨機老虎機物品-----------------
const startSlotBtn = document.getElementById('startSlotBtn');

function createMoreSlotItems() {
    const reelsInners = document.querySelectorAll('.reelsInner');
    const slotItemHeight = $('.slot').eq(0).height();

    reelsInners.forEach(reelsInner => {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < slotItemCount - 1; i++) {
            const slot = document.createElement('li');
            slot.className = 'slot'; 
            const iconUrl = `images/game/${getRandomIcon()}.png`;
            slot.style.backgroundImage = `url(${iconUrl})`;
            slot.style.height = `${slotItemHeight}px`;
            fragment.appendChild(slot);
        }

        const targetElement = reelsInner.querySelector('.slot.item');
        reelsInner.insertBefore(fragment, targetElement || null);
    });
}
createMoreSlotItems();

// Function 將中獎金額資訊和中獎圖示設定為“slotItem”和“winingPopUp”----------------
function settingData(winningValue) {
    $('.reelsInner').each(function() {
        const firstslotItem = $(this).find('.slot').first();
        
        if (firstslotItem.length) {
            firstslotItem.addClass('win');
            firstslotItem.css('background-image', `url(images/game/${winningValue}.png)`);
        }
    });

    var winningPopTxt = document.getElementById('winningPopTxt');
    winningPopTxt.textContent = winningValue;
}
// -------------------------------------------------

//Function 將最新條目新增至記錄框
function addDataRecord(eventCreateTime, eventMoney){
    $('#recordContainer-Inner table tr:not([template="recordTr"])').eq(5).remove() // 移除最下面一筆
    let newRecord = $('tr[template="recordTr"]').clone()
    newRecord.removeAttr('hidden')
    newRecord.removeAttr('template')
    newRecord.find('td').eq(0).html(eventCreateTime);
    newRecord.find('td').eq(1).html(eventMoney);
    
    $('#recordContainer-Inner table tbody').prepend(newRecord);

    // Function 找到沒有tbody的表格並將其隱藏
    function updateTableVisibility() {
        $('#recordContainer-Inner table').each(function() {
            var $table = $(this);
            var $tbody = $table.find('tbody');
            $tbody.length === 0 ? $table.css('height', '0%') : $table.css('height', '100%');
        });
    }

    updateTableVisibility();
    $('#recordContainer-Inner table').show();
    $('#recordContainer-Inner h4').hide();
}

// //win彈出框開啟時的函數----------------------------
const confirmWin = document.getElementById('confirmWin');

const popWinAudio = new Audio('music/popWin.mp3');
popWinAudio.load;
popWinAudio.volume = 0.7;
const laughAudio = new Audio('music/laugh.mp3');
laughAudio.load;
laughAudio.volume = 0.7;

function openWinPop(){
    confirmWin.removeAttribute('onclick');
    winningPopUp.removeAttribute('onclick');
    closeWinPopUp.removeAttribute('onclick');

    winningPopUp.classList.add('openPopUp');
    document.body.style.overflow = 'hidden';

    popWinAudio.currentTime = 0;
    popWinAudio.muted = false;
    popWinAudio.play().catch(console.error);

    if (isPlaying) { bgAudio.pause(); }

    setTimeout(() => {
        laughAudio.currentTime = 0;
        laughAudio.muted = false;
        laughAudio.play().catch(console.error);
    }, 500);

    setTimeout(() => {
        if (isPlaying) { 
            bgAudio.play().catch(console.error);
        }
        confirmWin.setAttribute('onclick', 'closeWinPop();');
        winningPopUp.setAttribute('onclick', 'closeWinPop();');
        closeWinPopUp.setAttribute('onclick', 'closeWinPop();');
    }, 3500);
}

// //關閉win彈出視窗的函數--------------------------------
let hasCreatedItems = false;

function closeWinPop(){
    if (!hasCreatedItems) {
        createMoreSlotItems();
        hasCreatedItems = true;
    }
    startSlotBtn.classList.remove('disabled');
    laughAudio.pause();
    setTimeout(() => {
        winningPopUp.classList.remove('openPopUp');
        document.body.style.overflow = '';
    }, 100);
}

// 啟動和拉動手把效果-----------------------------
const startRollAudio = new Audio('music/clickStart.mp3');
startRollAudio.load;
const leverPullAudio = new Audio('music/levelPull.m4a');
leverPullAudio.load;

function pullLeverEffect() {
    startRollAudio.currentTime = 0;
    startRollAudio.muted = false;
    startRollAudio.play().catch(console.error);

    setTimeout(() => {
        startRollAudio.pause();

        leverPullAudio.currentTime = 0;
        leverPullAudio.muted = false;
        leverPullAudio.play().catch(console.error);

        slotHandle.classList.add('pull');
    }, 500);

    setTimeout(() => {
        slotHandle.classList.remove('pull');
    }, 1000);

    setTimeout(() => {
        leverPullAudio.pause();
    }, 1500);
}

// -------------------------------------------------
const rollPlayAudio = new Audio('music/rollPlay.mp3');
rollPlayAudio.load;
rollPlayAudio.volume = 0.7;

const rollStopAudio = new Audio('music/rollStop.mp3');
rollStopAudio.load;
rollStopAudio.volume = 0.7;

function spinningAnimation() {
    const reelsInners = document.querySelectorAll('.reelsInner');

    rollPlayAudio.currentTime = 0.6;
    rollPlayAudio.muted = false;
    rollPlayAudio.play().catch(console.error);

    rollStopAudio.currentTime = 0;

    reelsInners.forEach((reelsInner, index) => {
        setTimeout(() => {
            void reelsInner.offsetWidth;  // Trigger reflow
            reelsInner.classList.add('spinning');

            setTimeout(() => {
                reelsInner.querySelectorAll('.slot').forEach(slot => {
                    if (!slot.classList.contains('win')) slot.remove();
                    setTimeout(() => { slot.classList.replace('win', 'item'); }, 500);
                    hasCreatedItems = false;
                });

                reelsInner.classList.remove('spinning');
                rollPlayAudio.pause();

                rollStopAudio.muted = false;
                rollStopAudio.play().catch(console.error);

            }, 2000);  // Spinning duration

            setTimeout(() => {
                rollStopAudio.pause();
            }, 3000);  // after spinning duration

        }, index * 100);  // Delay for each reel
    });
}

// -------------------------------------------------
const alarmAudio = new Audio('music/alarm.mp3');
alarmAudio.load;
alarmAudio.volume = 1;

function addAlarmEffect(){
    var classNames = ['top', 'right', 'bottom', 'left'];
    classNames.forEach(function(className) {
        var span = document.createElement('span');
        span.className = className;
        borderEffect.appendChild(span);
    });

    alarmAudio.currentTime = 0;
    alarmAudio.muted = false;
    alarmAudio.play().catch(console.error);

    borderEffect.classList.add('spinningBorder');
    slotMachineContainer.classList.add('glowingAlarm');
    setTimeout(() => {
        borderEffect.classList.remove('spinningBorder');
        borderEffect.classList.add('spinnedBorder');
    }, 1600); //<- spinning border duration

    setTimeout(() => {
        alarmAudio.pause();
        slotMachineContainer.classList.remove('glowingAlarm');
    }, 2300); //<- after spinning border duration
}

function removeAlarmEffect(){
    borderEffect.classList.remove('spinnedBorder');
    while (borderEffect.firstChild) {
        borderEffect.removeChild(borderEffect.firstChild);
    }
}

// 老虎機點擊手柄----------------------------------------------
function handleButtonClick(){
    if (!ifLogin) return openNotLoginPopUp(); //<-如果您未登錄，將開啟一個非登入彈出窗口，並且無法點擊遊戲項目。
    if (noMoreDrawChances) return openNoDrawsPopUp(); //<-如果沒有更多抽獎，則會出現抽獎彈出窗口

    startSlotBtn.classList.add('disabled');
    
    preloadAudio();
    removeAlarmEffect();
    pullLeverEffect();

    let prizeResult = { 
        openMoney: getRandomIcon(),
        lotteryAmount: '1',
        redEnvelopeArray: [
            {
                eventCreateTime: '2024/3/26 02:00:00',
                eventMoney: '10,000'
            }
        ]
    };

    let winningValue = prizeResult.openMoney;
    leftDrawAmount = prizeResult.lotteryAmount;
    
    let rea = prizeResult.redEnvelopeArray[0];
    let eventCreateTime = rea.eventCreateTime;
    let eventMoney = rea.eventMoney;

    setTimeout(settingData(winningValue), 1000);
    setTimeout(spinningAnimation, 1100);
    setTimeout(addAlarmEffect, 3600);
    setTimeout(openWinPop, 6000);

    updateslotCountSpanNumber(); 
    addDataRecord(eventCreateTime, eventMoney);
}

// -------------------------------------------------

//彈出活動規則
function openActivityRulePopUp() {
    setTimeout(() => {
        activityRulesPopUp.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 100); 
}

function closeActivityRulePopUp() {
    setTimeout(() => {
        activityRulesPopUp.style.display = 'none';
        document.body.style.overflow = '';
    }, 100); 
}

//日誌彈出視窗
function openRecordPopUp() {
    setTimeout(() => {
        recordConPopUp.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 100); 
}

function closeRecordPopUp() {
    setTimeout(() => {
        recordConPopUp.style.display = 'none';
        document.body.style.overflow = '';
    }, 100); 
}

// 未登入彈出窗口
function openNotLoginPopUp() {
    notLoginPopUp.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeNotLoginPopUp() {
    setTimeout(() => {
        notLoginPopUp.style.display = 'none';
        document.body.style.overflow = '';
    }, 100); 
}

// 沒有抽獎次數
function openNoDrawsPopUp() {
    noDrawsPopUp.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeNoDrawsPopUp() {
    setTimeout(() => {
        noDrawsPopUp.style.display = 'none';
        document.body.style.overflow = '';
    }, 100); 
}
