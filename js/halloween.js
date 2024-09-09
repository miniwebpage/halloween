
// -------------------------------------------------
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

var isEventEnabled = 'true';
// var isEventEnabled = '{$eventEnabled}';
let ifLogin = (isEventEnabled == 'true');

// var leftDrawAmount = parseInt('{$lotteryAmount}'); <- 當後端準備好時，取消註解此行並刪除具有相同變數的 set static 變數
let leftDrawAmount = 1;
leftDrawAmount = isNaN(Number(leftDrawAmount)) || leftDrawAmount === null ? 0 : Number(leftDrawAmount);

// -------------------------------------------------

//更新繪製計數顯示的功能
let noMoreDrawChances = false;
const slotCountSpan = document.getElementById('slotCountSpan');
function updateslotCountSpanNumber() {
    if(slotCountSpan) slotCountSpan.textContent = leftDrawAmount;
    if (leftDrawAmount == 0) noMoreDrawChances = true;
}
updateslotCountSpanNumber();

// -------------------------------------------------

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
// -------------------------------------------------

function getRandomIcon() {
    const icons = [ '8888', '1688', '888', '588', '188','58'];
    return icons[Math.floor(Math.random() * icons.length)];
}

// -------------------------------------------------

let slotItemCount = 34;
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

// -------------------------------------------------

const startSlotBtn = document.getElementById('startSlotBtn');

function createMoreSlotItems(winningValue) {
    const winIcon = `images/game/${winningValue}.png`;
    
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

        setTimeout(() => {
            const firstslot = reelsInner.querySelector('.slot');
            if (firstslot) {
                firstslot.classList.add('win');
                firstslot.style.backgroundImage = `url(${winIcon})`;
            }
        }, 1000);
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

// -------------------------------------------------

const confirmWin = document.getElementById('confirmWin');

const popWinAudio = new Audio('music/popWin.mp3');
popWinAudio.load;
popWinAudio.volume = 0.7;
const laughAudio = new Audio('music/laugh.mp3');
laughAudio.load;
laughAudio.volume = 0.7;

function openWinPop(){
    confirmWin.classList.add('disabled');
    closeWinPopUp.classList.add('disabled');

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

        setTimeout(() => {
            if (isPlaying) { 
                bgAudio.play().catch(console.error);
            }
            confirmWin.classList.remove('disabled');
            closeWinPopUp.classList.remove('disabled');
        }, 3000);
    }, 500);
}

function closeWinPop(){
    startSlotBtn.classList.remove('disabled');
    laughAudio.pause();
    setTimeout(() => {
        winningPopUp.classList.remove('openPopUp');
        document.body.style.overflow = '';
    }, 500);
}

// -------------------------------------------------

// animation slot machine
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

        setTimeout(() => {
            slotHandle.classList.remove('pull');
            setTimeout(() => {
                leverPullAudio.pause();
            }, 500);
        }, 500);
        
    }, 500);
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
                });

                reelsInner.classList.remove('spinning');
                rollPlayAudio.pause();

                rollStopAudio.muted = false;
                rollStopAudio.play().catch(console.error);

                setTimeout(() => {
                    rollStopAudio.pause();
                }, 1000);

            }, 2000);  // Spinning duration
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
        setTimeout(() => {
            alarmAudio.pause();
            slotMachineContainer.classList.remove('glowingAlarm');
        }, 700);
    }, 1600); //<- spinning border duration
}

function removeAlarmEffect(){
    borderEffect.classList.remove('spinnedBorder');
    while (borderEffect.firstChild) {
        borderEffect.removeChild(borderEffect.firstChild);
    }
}

// -----------------------------------------------------------
function handleButtonClick(){
    if (!ifLogin) return openNotLoginPopUp(); //<-如果您未登錄，將開啟一個非登入彈出窗口，並且無法點擊遊戲項目。
    if (noMoreDrawChances) return openNoDrawsPopUp(); //<-如果沒有更多抽獎，則會出現抽獎彈出窗口

    startSlotBtn.classList.add('disabled');
    
    preloadAudio();
    removeAlarmEffect();
    pullLeverEffect();

    let prizeResult = { 
        openMoney: getRandomIcon(),
        lotteryAmount: '0',
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

    createMoreSlotItems(winningValue);
    setTimeout(() => {
        spinningAnimation();
        setTimeout(() => {
            addAlarmEffect();
            setTimeout(() => {
                openWinPop();
            }, 2400);
        }, 2500);
    }, 1100);
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
