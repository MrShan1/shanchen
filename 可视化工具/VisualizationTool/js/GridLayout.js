function um() {
    0 < arguments.length && z.od(um);
    yg.call(this);
    this.nx = !0;
    this.ct = this.dt = NaN;
    this.Aj = (new Ea(NaN, NaN)).freeze();
    this.bi = (new Ea(10, 10)).freeze();
    this.Ie = wn;
    this.qd = un;
    this.ai = qn;
    this.Lh = Bq
}
z.Qa(um, yg);
z.ia("GridLayout", um);
um.prototype.cloneProtected = function (a) {
    yg.prototype.cloneProtected.call(this, a);
    a.dt = this.dt;
    a.ct = this.ct;
    a.Aj.assign(this.Aj);
    a.bi.assign(this.bi);
    a.Ie = this.Ie;
    a.qd = this.qd;
    a.ai = this.ai;
    a.Lh = this.Lh
};
um.prototype.doLayout = function (a) {
    null === a && z.k("Layout.doLayout(collection) argument must not be null but a Diagram, a Group, or an Iterable of Parts");
    this.je = this.initialOrigin(this.je);
    var b = this.h;
    a = this.$G(a);
    for (var c = a.copy().i; c.next() ;) {
        var d = c.value;
        if (d instanceof G) {
            var e = d;
            if (null !== e.Y || null !== e.da) {
                a.remove(e);
                continue
            }
        }
        d.Bf();
        if (d instanceof F) for (d = d.Hc; d.next() ;) a.remove(d.value)
    }
    e = a.jc();
    if (0 !== e.length) {
        switch (this.sorting) {
            case tn:
                e.reverse();
                break;
            case qn:
                e.sort(this.comparer);
                break;
            case rn:
                e.sort(this.comparer),
                e.reverse()
        }
        var g = this.DJ;
        isNaN(g) && (g = 0);
        var h = this.iG,
        h = isNaN(h) && null !== b ? Math.max(b.xb.width - b.padding.left - b.padding.right, 0) : Math.max(this.iG, 0);
        0 >= g && 0 >= h && (g = 1);
        a = this.spacing.width;
        isFinite(a) || (a = 0);
        c = this.spacing.height;
        isFinite(c) || (c = 0);
        null !== b && b.Wb("Layout");
        d = [];
        switch (this.alignment) {
            case xn:
                var k = a,
                l = c,
                m = Math.max(this.cp.width, 1);
                if (!isFinite(m)) for (var n = m = 0; n < e.length; n++) var p = e[n],
                q = p.Ia,
                m = Math.max(m, q.width);
                var m = Math.max(m + k, 1),
                r = Math.max(this.cp.height, 1);
                if (!isFinite(r)) for (n = r = 0; n < e.length; n++) p = e[n],
                q = p.Ia,
                r = Math.max(r, q.height);
                for (var r = Math.max(r + l, 1), s = this.Yf, t = this.je.x, v = t, x = this.je.y, y = 0, A = 0, n = 0; n < e.length; n++) {
                    var p = e[n],
                    q = p.Ia,
                    C = Math.ceil((q.width + k) / m) * m,
                    L = Math.ceil((q.height + l) / r) * r,
                    H = 0;
                    switch (s) {
                        case vn:
                            H = Math.abs(v - q.width);
                            break;
                        default:
                            H = v + q.width
                    }
                    if (0 < g && y > g - 1 || 0 < h && 0 < y && H > h) d.push(new w(0, x, h + k, A)),
                    y = 0,
                    v = t,
                    x += A,
                    A = 0;
                    A = Math.max(A, L);
                    L = 0;
                    switch (s) {
                        case vn:
                            L = -q.width;
                            break;
                        default:
                            L = 0
                    }
                    p.moveTo(v + L, x);
                    switch (s) {
                        case vn:
                            v -= C;
                            break;
                        default:
                            v += C
                    }
                    y++
                }
                d.push(new w(0, x, h + k, A));
                break;
            case wn:
                k = g;
                l = a;
                m = c;
                n = Math.max(this.cp.width, 1);
                p = x = C = 0;
                q = z.O();
                for (g = 0; g < e.length; g++) r = e[g],
                s = r.Ia,
                t = qp(r, r.Zb, r.of, q),
                C = Math.max(C, t.x),
                x = Math.max(x, s.width - t.x),
                p = Math.max(p, t.y);
                v = this.Yf;
                switch (v) {
                    case vn:
                        C += l;
                        break;
                    default:
                        x += l
                }
                var n = isFinite(n) ? Math.max(n + l, 1) : Math.max(C + x, 1),
                U = x = this.je.x,
                y = this.je.y,
                A = 0;
                h >= C && (h -= C);
                for (var C = L = 0,
                H = Math.max(this.cp.height, 1), ea = p = 0, W = !0, P = z.O(), g = 0; g < e.length; g++) {
                    r = e[g];
                    s = r.Ia;
                    t = qp(r, r.Zb, r.of, q);
                    if (0 < A) switch (v) {
                        case vn:
                            U = (U - x - (s.width - t.x)) / n;
                            U = td(Math.round(U), U) ? Math.round(U) : Math.floor(U);
                            U = U * n + x;
                            break;
                        default:
                            U = (U - x + t.x) / n,
                            U = td(Math.round(U), U) ? Math.round(U) : Math.ceil(U),
                            U = U * n + x
                    } else switch (v) {
                        case vn:
                            L = U + t.x + s.width;
                            break;
                        default:
                            L = U - t.x
                    }
                    var ba = 0;
                    switch (v) {
                        case vn:
                            ba = -(U + t.x) + L;
                            break;
                        default:
                            ba = U + s.width - t.x - L
                    }
                    if (0 < k && A > k - 1 || 0 < h && 0 < A && ba > h) {
                        d.push(new w(0, W ? y - p : y, h + l, ea + p + m));
                        for (U = 0; U < A && g !== A; U++) {
                            var ba = e[g - A + U],
                            Oa = qp(ba, ba.Zb, ba.of, P);
                            ba.moveTo(ba.position.x, ba.position.y + p - Oa.y)
                        }
                        ea += m;
                        y = W ? y + ea : y + (ea + p);
                        A = ea = p = 0;
                        U = x;
                        W = !1
                    }
                    U === x && (C = v === vn ? Math.max(C, s.width - t.x) : Math.min(C, -t.x));
                    p = Math.max(p, t.y);
                    ea = Math.max(ea, s.height - t.y);
                    isFinite(H) && (ea = Math.max(ea, Math.max(s.height, H) - t.y));
                    W ? r.moveTo(U - t.x, y - t.y) : r.moveTo(U - t.x, y);
                    switch (v) {
                        case vn:
                            U -= t.x + l;
                            break;
                        default:
                            U += s.width - t.x + l
                    }
                    A++
                }
                d.push(new w(0, y, h + l, (W ? ea : ea + p) + m));
                for (U = 0; U < A && g !== A; U++) ba = e[g - A + U],
                Oa = qp(ba, ba.Zb, ba.of, q),
                ba.moveTo(ba.position.x, ba.position.y + p - Oa.y);
                z.A(q);
                z.A(P);
                if (v === vn) for (g = 0; g < d.length; g++) e = d[g],
                e.width += C,
                e.x -= C;
                else for (g = 0; g < d.length; g++) e = d[g],
                e.x > C && (e.width += e.x - C, e.x = C)
        }
        for (k = g = h = e = 0; k < d.length; k++) l = d[k],
        e = Math.min(e, l.x),
        h = Math.min(h, l.y),
        g = Math.max(g, l.x + l.width);
        this.Yf === vn ? this.commitLayers(d, new N(e + a / 2 - (g + e), h - c / 2)) : this.commitLayers(d, new N(e - a / 2, h - c / 2));
        null !== b && b.Jd("Layout");
        this.Gf = !0
    }
};
um.prototype.commitLayers = function () { };
z.defineProperty(um, {
    iG: "wrappingWidth"
},
function () {
    return this.dt
},
function (a) {
    this.dt !== a && (z.g(a, "number", um, "wrappingWidth"), 0 < a || isNaN(a)) && (this.dt = a, this.nx = isNaN(a), this.I())
});
z.defineProperty(um, {
    DJ: "wrappingColumn"
},
function () {
    return this.ct
},
function (a) {
    this.ct !== a && (z.g(a, "number", um, "wrappingColumn"), 0 < a || isNaN(a)) && (this.ct = a, this.I())
});
z.defineProperty(um, {
    cp: "cellSize"
},
function () {
    return this.Aj
},
function (a) {
    z.l(a, Ea, um, "cellSize");
    this.Aj.N(a) || (this.Aj.assign(a), this.I())
});
z.defineProperty(um, {
    spacing: "spacing"
},
function () {
    return this.bi
},
function (a) {
    z.l(a, Ea, um, "spacing");
    this.bi.N(a) || (this.bi.assign(a), this.I())
});
z.defineProperty(um, {
    alignment: "alignment"
},
function () {
    return this.Ie
},
function (a) {
    this.Ie !== a && (z.Ba(a, um, um, "alignment"), a === wn || a === xn) && (this.Ie = a, this.I())
});
z.defineProperty(um, {
    Yf: "arrangement"
},
function () {
    return this.qd
},
function (a) {
    this.qd !== a && (z.Ba(a, um, um, "arrangement"), a === un || a === vn) && (this.qd = a, this.I())
});
z.defineProperty(um, {
    sorting: "sorting"
},
function () {
    return this.ai
},
function (a) {
    this.ai !== a && (z.Ba(a, um, um, "sorting"), a === sn || a === tn || a === qn || a === rn) && (this.ai = a, this.I())
});
z.defineProperty(um, {
    comparer: "comparer"
},
function () {
    return this.Lh
},
function (a) {
    this.Lh !== a && (z.g(a, "function", um, "comparer"), this.Lh = a, this.I())
});
var Bq;
um.standardComparer = Bq = function (a, b) {
    u && z.l(a, D, um, "standardComparer:a");
    u && z.l(b, D, um, "standardComparer:b");
    var c = a.text,
    d = b.text;
    return c < d ? -1 : c > d ? 1 : 0
};
um.smartComparer = function (a, b) {
    u && z.l(a, D, um, "standardComparer:a");
    u && z.l(b, D, um, "standardComparer:b");
    if (null !== a) {
        if (null !== b) {
            for (var c = a.text.toLocaleLowerCase().split(/([+\-]?[\.]?\d+(?:\.\d*)?(?:e[+\-]?\d+)?)/), d = b.text.toLocaleLowerCase().split(/([+\-]?[\.]?\d+(?:\.\d*)?(?:e[+\-]?\d+)?)/), e = 0; e < c.length; e++) if ("" !== d[e] && void 0 !== d[e]) {
                var g = parseFloat(c[e]),
                h = parseFloat(d[e]);
                if (isNaN(g)) {
                    if (!isNaN(h)) return 1;
                    if (0 !== c[e].localeCompare(d[e])) return c[e].localeCompare(d[e])
                } else {
                    if (isNaN(h)) return -1;
                    if (0 !== g - h) return g - h
                }
            } else if ("" !== c[e]) return 1;
            return "" !== d[e] && void 0 !== d[e] ? -1 : 0
        }
        return 1
    }
    return null !== b ? -1 : 0
};
var xn;
um.Position = xn = z.s(um, "Position", 0);
var wn;
um.Location = wn = z.s(um, "Location", 1);
var un;
um.LeftToRight = un = z.s(um, "LeftToRight", 2);
var vn;
um.RightToLeft = vn = z.s(um, "RightToLeft", 3);
var sn;
um.Forward = sn = z.s(um, "Forward", 4);
var tn;
um.Reverse = tn = z.s(um, "Reverse", 5);
var qn;
um.Ascending = qn = z.s(um, "Ascending", 6);
var rn;
um.Descending = rn = z.s(um, "Descending", 7);