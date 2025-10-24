// strategies/strategy_1.js
export function runStrategy(data) {
    if (!data || data.length === 0) return;

    const shortPeriod = 9;
    const longPeriod = 20;

    // EMA hesaplama
    function emaCalc(data, period) {
        const k = 2 / (period + 1);
        let prev = data.slice(0, period).reduce((sum,d)=>sum+d.close,0)/period;
        const out = [{ time: data[period-1].time, value: prev }];
        for(let i=period;i<data.length;i++){
            prev = data[i].close*k + prev*(1-k);
            out.push({ time: data[i].time, value: prev });
        }
        return out;
    }

    const emaShort = emaCalc(data, shortPeriod);
    const emaLong = emaCalc(data, longPeriod);

    // Sinyal tespiti
    const signals = [];
    for(let i=1; i<emaLong.length; i++){
        const prevCross = emaShort[i+shortPeriod-longPeriod-1].value - emaLong[i-1].value;
        const currCross = emaShort[i+shortPeriod-longPeriod].value - emaLong[i].value;
        if(prevCross < 0 && currCross > 0) signals.push({time:data[i+longPeriod-1].time, type:'BUY'});
        if(prevCross > 0 && currCross < 0) signals.push({time:data[i+longPeriod-1].time, type:'SELL'});
    }

    console.log("Strateji 1 sinyalleri:", signals);
    alert(`Strateji 1: ${signals.length} sinyal bulundu!`);

    // NOT: Grafiğe ok ekleme index.html tarafında yapılacak
}
