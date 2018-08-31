export function odooParseLine(acc, line, idx, lines) {
    const result = (line.display_name+line.qty)
        .replace(/Pre-Order Posy/gm, '-PO')
        .replace(/Posy Subscription/gm, '-PS')
        .replace(/Daily Posy/gm, '-PD')
        .replace(/Bright Posy/gm, '-PB')
        .replace(/Sunflower Posy/gm, '-PF')
        .replace(/Native Posy/gm, '-PN')
        .replace(/White.*Posy/gm, '-PW')

        .replace(/Balmoral Candle/gm, '-B')
        .replace(/Reed Diffuser/gm, '-D')
        .replace(/Chocolates/gm, '-C')
        .replace(/Greeting Card/gm, '-G')

        .replace(/Wild Peony/gm, 'WP')
        .replace(/Coconut.*Lime/gm, 'CL')
        .replace(/Coconut.*Vanilla/gm, 'CV')
        .replace(/Cedanvood.*Jasmine/gm, 'CJ')
        .replace(/Sandalwood.*Patchouli/gm, 'SP')
        .replace(/Champagne.*Strawberries/gm, 'CS')
        .replace(/Lime Basil Madarin/gm, 'LB')
        .replace(/Very Vanilla/gm, 'BP')
        .replace(/Lime Basil Madarin /gm, 'LB')


        .replace(/Small/gm, 'S')
        .replace(/Medium/gm, 'M')
        .replace(/Extra Large/gm, 'X')
        .replace(/Large/gm, 'L')

        .replace(/.*Delivery.*/gm, '')

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
        orderNo: Number(order.id.slice(2))+100000,
        orderDate: order.write_date,
        customerName: order.snd.name,
        customerEmail: order.snd.email,
        customerPhone: order.snd.phone,
        productCode: odooParseLines(order.lines),
        amount: order.amount_total,
        deliveryDate: order.delivery.days,
        deliveryName: order.rcv.name,
        shipAddress: [ order.rcv.name, order.rcv.address ],
        shipInstructions: order.rcv.special,
        deliveryTo: order.card.to,
        specialMessage: order.card.message,
        deliveryFrom: order.card.from,
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

