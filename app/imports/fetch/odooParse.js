export function odooParseLine(acc, line, idx, lines) {
    const result = (line.display_name+line.qty)
        .replace(/Pre-Order Posy/gm, '-Ppre')
        .replace(/Posy Subscription/gm, '-Psub')
        .replace(/Daily Posy/gm, '-Pday')
        .replace(/Bright Posy/gm, '-Pbrt')
        .replace(/Sunflower Posy/gm, '-Psun')
        .replace(/Pastel Posy/gm, '-Pstl')
        .replace(/Native Posy/gm, '-Pnat')
        .replace(/White.*Posy/gm, '-Pwgn')
        .replace(/Saturday Posy/gm, '-Psat')
        .replace(/Christmas Posy/gm, '-Pxms')

        .replace(/\(([^)]*), (Small|Medium|Extra Large|Large)\)/gm, '($2, $1)')

        .replace(/White - Malborough Sauvignon Blanc 2017/gm, '-WineWht')
        .replace(/Red - Barossa Shiraz 2017/gm, '-WineRed')

        .replace(/Balmoral Candle/gm, '-Cndl')
        .replace(/Reed Diffuser/gm, '-Diff')
        .replace(/Chocolates/gm, '-Choc')
        .replace(/Orchid/gm, '-Orch')
        .replace(/Christmas Wreath/gm, '-Wrth')

        .replace(/Standard Gift Card/gm, '')
        .replace(/Botanical Greeting Card/gm, '-CardBtnc')
        .replace(/A Christmas Greeting Card/gm, '-CardXmas')

        .replace(/Wild Peony/gm, 'Wp')
        .replace(/Coconut.*Lime/gm, 'Cl')
        .replace(/Coconut.*Vanilla/gm, 'Cv')
        .replace(/Cedarvood.*Jasmine/gm, 'Cj')
        .replace(/Sandalwood.*Patchouli/gm, 'Sp')
        .replace(/Champagne.*Strawberries/gm, 'Cs')
        .replace(/Lime Basil Madarin/gm, 'Lb')
        .replace(/Very Vanilla/gm, 'Bp')
        .replace(/Lime Basil Madarin /gm, 'Lb')

        .replace(/Box Wrap/gm, 'Bw')
        .replace(/Copper Cylinder Large/gm, 'Cl')
        .replace(/Luxury Copper/gm, 'Co')
        .replace(/Rustic Concrete Large/gm, 'Rl')
        .replace(/Rustic Concrete/gm, 'Rc')
        .replace(/White Large/gm, 'Wl')
        .replace(/White/gm, 'Wh')


        .replace(/Regular/gm, 'Rg')
        .replace(/Large \/w Succulants/gm, 'Lg')

        .replace(/Small/gm, 'Sm')
        .replace(/Medium/gm, 'Md')
        .replace(/Extra Large/gm, 'Xl')
        .replace(/Large/gm, 'Lg')

        .replace(/.*Delivery.*/gm, '')
        .replace(/.*Gift Coupon.*/gm, '')
        .replace(/No/gm, '')

        // .replace(/.{6,}/gm, '-???')

        .replace(/\(/gm, '')
        .replace(/\)/gm, '')
        .replace(/,/gm, '')
        .replace(/ /gm, '')
    return acc + result;
}

export function odooParseLines(lines) {
    return lines.reduce(odooParseLine, '');
}


export function odooParseOrder(order) {
    const result = {
        orderNo: Number(order.id.slice(2)),
        orderDate: order.write_date,
        customerName: order.snd.name,
        customerEmail: order.snd.email,
        customerPhone: order.snd.phone,
        productCode: odooParseLines(order.lines),
        amount: new Intl.NumberFormat('en-AU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(order.amount_total),
        deliveryDate: order.delivery.days,
        deliveryName: order.rcv.name,
        deliveryPhone: order.rcv.phone,
        shipAddress: [ order.rcv.name, order.rcv.address ],
        shipInstructions: order.rcv.special,
        deliveryTo: order.card.to,
        specialMessage: order.card.message,
        deliveryFrom: order.card.from,
        isOdoo: true,
    }
    if (order.rcv.latitude && order.rcv.longitude) {
        result.shipLocation = {
            lat: order.rcv.latitude,
            lng: order.rcv.longitude,
            geoAddr: order.rcv.address,
        };
    }
    return result;
}

