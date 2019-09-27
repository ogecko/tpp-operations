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
        .replace(/Birthday Posy/gm, '-Pbirthday')

        .replace(/Mother.s Day Orders/gm, '-MothersDay')
        .replace(/Valentine.s Day/gm, '-ValentinesDay')

        .replace(/\(([^)]*), (Small|Medium|Extra Large|Large)\)/gm, '($2, $1)')

        .replace(/White - Malborough Sauvignon Blanc 2017/gm, '-WineWht')
        .replace(/Red - Barossa Shiraz 2017/gm, '-WineRed')

        .replace(/No Chocolates/gm, '')     // cater for Product variant with with "No Chocolates"
        .replace(/No Socks/gm, '')          // cater for Product variant with with "No Socks"
        .replace(/No Vase/gm, '')           // cater for Product variant with with "No Vase"
        .replace(/Add Vase/gm, 'Vase')      // cater for Product variant with with "Add Vase"
        .replace(/Balmoral Candle/gm, '-Cndl')
        .replace(/Reed Diffuser/gm, '-Diff')
        .replace(/Chocolates/gm, '-Choc')
        .replace(/Orchid/gm, '-Orch')
        .replace(/Christmas Wreath/gm, '-Wrth')
        .replace(/Vase/gm, '-Vase')

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
        .replace(/Blackberry.*Plum/gm, 'Bp')
        .replace(/Very Vanilla/gm, 'Vv')

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

        .replace(/Additional Delivery Charge/gm, '-AddFee')
        .replace(/.(\d{1,2}) Delivery/gm, '-$1Fee')
        .replace(/No Deliveries/gm, '-OutFee')
        .replace(/Free Delivery.*/gm, '')

        .replace(/.*Gift Coupon.*/gm, '')
        .replace(/No/gm, '')

        // .replace(/.{6,}/gm, '-???')

        .replace(/\(/gm, '')
        .replace(/\)/gm, '')
        .replace(/ /gm, '')
        .replace(/,/gm, '')    // Allow a word wrap on each item
    
    // insert a space if product code getting too long
    const out = (result.length>15 && result[0]!='-') ? acc + result + ' ': acc + result;
    return out;
}

export function odooParseLines(lines) {
    return lines.reduce(odooParseLine, '');
}

function abbrRoadPostfix(address) {
    return address
        .replace(/Avenue/gm,'Ave')
        .replace(/Close/gm,'Cl')
        .replace(/Court/gm,'Ct')
        .replace(/Crescent/gm,'Cr')
        .replace(/Drive/gm,'Dr')
        .replace(/Highway/gm,'Hwy')
        .replace(/Lane/gm,'Ln')
        .replace(/Place/gm,'Pl')
        .replace(/Road/gm,'Rd')
        .replace(/Street/gm,'St')
}

function removeAustralia(address) {
    return address
        .replace(/(, )?Australia$/,'')
}

export function cleanAddress(address) {
    if (! _.isString(address)) return '';
    return abbrRoadPostfix(removeAustralia(address));
}

export function odooParseShipAddress(address, instructions, business) {
    const re = /, Australia$/;
    let addr = cleanAddress(address);
    let inst = cleanAddress(instructions);
    let busn = (! _.isString(business)) ? '' : business

    // if the tails of both address and instructions has ', Australia' then consider reduction
    if (re.test(address) && re.test(instructions)) {
        const revisedAddr = addr
            .split(', ')                                        // split cleaned address into separate terms
            .map(term => (inst.includes(term)? '' : term))      // nuke any addr terms that are duplicated in the special instructions
            .map(term => (busn.includes(term)? '' : term))      // nuke any addr terms that are duplicated in the business name
            .filter(term => term.length>0)                      // only keep terms with content
            .join(', ')                                         // join the terms back up again
        if (revisedAddr.length != addr.length) {
            addr = (revisedAddr.length==0)? inst : `${revisedAddr}, ${inst}`;
            inst = '';
        }
    }

    // insert the business name into the addr
    // if (business.length>0) {
    //     addr = `${busn}, ${addr}`
    // }

    // return the revised address and instructions
    return { addr, inst, busn }
}

export function odooParseOrder(order) {
    const ship = odooParseShipAddress(order.rcv.address, order.rcv.special, order.rcv.business)
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
        deliveryBusiness: order.rcv.business,
        deliveryPhone: order.rcv.phone,
        shipAddress: ship.busn ? [ order.rcv.name, ship.busn, ship.addr ] : [ order.rcv.name, ship.addr ],
        shipInstructions: ship.inst,
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

