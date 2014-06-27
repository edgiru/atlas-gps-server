var md5 = function () {
    var m = {};
    var d = function (s) {
        var q, p = [];
        for (q = 0; q < s.length; q = q + 1) {
            var t = s.charCodeAt(q);
            var r = [];
            do {
                r.push(t & 255);
                t = t >> 8
            } while (t > 0);
            p = p.concat(r.reverse())
        }
        return p
    };
    var h = function (r) {
        var p = [];
        var q;
        for (q = 0; q < r.length; q += 2) {
            p.push(parseInt(r.slice(q, q + 2), 16))
        }
        return p
    };
    var o = function (v) {
        var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var s, r, q, p;
        var x = [];
        var t, w;
        for (t = 0; t < v.length; t += 4) {
            s = u.indexOf(v.charAt(t));
            r = u.indexOf(v.charAt(t + 1));
            q = u.indexOf(v.charAt(t + 2));
            p = u.indexOf(v.charAt(t + 3));
            x.push((s << 2) | (r >> 4));
            w = ((r & 15) << 4) | (q >> 2);
            if (w !== 64) {
                x.push(w)
            }
            w = ((q & 3) << 6) | p;
            if (w !== 64) {
                x.push(w)
            }
        }
        return x
    };
    var e = function (r) {
        var p = [];
        var q;
        for (q = 0; q < 4; q = q + 1) {
            p.push(r & 255);
            r >>>= 8
        }
        return p
    };
    var b = function (p) {
        var r;
        var q;
        for (q = 3; q >= 0; q = q - 1) {
            r = r * Math.pow(2, 8);
            r |= (p[q] & 255)
        }
        return r
    };
    var l = function (p, r, q) {
        return e((b(p) & b(r)) | ((~b(p)) & b(q)))
    };
    var j = function (p, r, q) {
        return e((b(p) & b(q)) | (b(r) & (~b(q))))
    };
    var g = function (p, r, q) {
        return e(b(p) ^ b(r) ^ b(q))
    };
    var f = function (p, r, q) {
        return e(b(r) ^ (b(p) | (~b(q))))
    };
    var k = function (p, r) {
        var q = b(p);
        return e((q << r) | (q >>> (32 - r)))
    };
    var n = function (r, q) {
        var p = [];
        var u = 0;
        var s = 0;
        var t;
        for (t = 0; t < 4; t += 1) {
            s = (r[t] + q[t] + u);
            u = s & 65280;
            p.push(s & 255);
            u >>>= 8
        }
        return p
    };
    var c = function (r, q, y, w, p, t, v, u) {
        return n(k(n(r, n(u(q, y, w), n(p, v))), t), q)
    };
    var a = function (s, q, w, v) {
        var p = "", u = "";
        var r = s.concat(q, w, v);
        var t = 0;
        for (t = 0; t < r.length; t += 1) {
            u = r[t].toString(16);
            p += ("00" + u).slice(-2)
        }
        return p
    };
    var i = function (D) {
        var H = D.length * 8;
        D.push(128);
        while (((D.length * 8) % 512) < 448) {
            D.push(0)
        }
        D.push(H & 255);
        D.push(H & 65280);
        D.push(H & 16711680);
        D.push(H & 4278190080);
        D.push(H & 1095216660480);
        D.push(H & 280375465082880);
        D.push(H & 71776119061217280);
        D.push(H & 18374686479671624000);
        var I = function (T, S) {
            var R = T + (S * 4);
            return D.slice(R, R + 4)
        };
        var Q = [1, 35, 69, 103];
        var P = [137, 171, 205, 239];
        var N = [254, 220, 186, 152];
        var L = [118, 84, 50, 16];
        var B = 7, z = 12, x = 17, v = 22;
        var O = 5, M = 9, K = 14, J = 20;
        var t = 4, s = 11, r = 16, q = 23;
        var C = 6, A = 10, y = 15, w = 21;
        var F, p, u, E, G;
        for (G = 0; G < D.length; G += 64) {
            F = Q.slice(0);
            p = P.slice(0);
            u = N.slice(0);
            E = L.slice(0);
            Q = c(Q, P, N, L, I(G, 0), B, [120, 164, 106, 215], l);
            L = c(L, Q, P, N, I(G, 1), z, [86, 183, 199, 232], l);
            N = c(N, L, Q, P, I(G, 2), x, [219, 112, 32, 36], l);
            P = c(P, N, L, Q, I(G, 3), v, [238, 206, 189, 193], l);
            Q = c(Q, P, N, L, I(G, 4), B, [175, 15, 124, 245], l);
            L = c(L, Q, P, N, I(G, 5), z, [42, 198, 135, 71], l);
            N = c(N, L, Q, P, I(G, 6), x, [19, 70, 48, 168], l);
            P = c(P, N, L, Q, I(G, 7), v, [1, 149, 70, 253], l);
            Q = c(Q, P, N, L, I(G, 8), B, [216, 152, 128, 105], l);
            L = c(L, Q, P, N, I(G, 9), z, [175, 247, 68, 139], l);
            N = c(N, L, Q, P, I(G, 10), x, [177, 91, 255, 255], l);
            P = c(P, N, L, Q, I(G, 11), v, [190, 215, 92, 137], l);
            Q = c(Q, P, N, L, I(G, 12), B, [34, 17, 144, 107], l);
            L = c(L, Q, P, N, I(G, 13), z, [147, 113, 152, 253], l);
            N = c(N, L, Q, P, I(G, 14), x, [142, 67, 121, 166], l);
            P = c(P, N, L, Q, I(G, 15), v, [33, 8, 180, 73], l);
            Q = c(Q, P, N, L, I(G, 1), O, [98, 37, 30, 246], j);
            L = c(L, Q, P, N, I(G, 6), M, [64, 179, 64, 192], j);
            N = c(N, L, Q, P, I(G, 11), K, [81, 90, 94, 38], j);
            P = c(P, N, L, Q, I(G, 0), J, [170, 199, 182, 233], j);
            Q = c(Q, P, N, L, I(G, 5), O, [93, 16, 47, 214], j);
            L = c(L, Q, P, N, I(G, 10), M, [83, 20, 68, 2], j);
            N = c(N, L, Q, P, I(G, 15), K, [129, 230, 161, 216], j);
            P = c(P, N, L, Q, I(G, 4), J, [200, 251, 211, 231], j);
            Q = c(Q, P, N, L, I(G, 9), O, [230, 205, 225, 33], j);
            L = c(L, Q, P, N, I(G, 14), M, [214, 7, 55, 195], j);
            N = c(N, L, Q, P, I(G, 3), K, [135, 13, 213, 244], j);
            P = c(P, N, L, Q, I(G, 8), J, [237, 20, 90, 69], j);
            Q = c(Q, P, N, L, I(G, 13), O, [5, 233, 227, 169], j);
            L = c(L, Q, P, N, I(G, 2), M, [248, 163, 239, 252], j);
            N = c(N, L, Q, P, I(G, 7), K, [217, 2, 111, 103], j);
            P = c(P, N, L, Q, I(G, 12), J, [138, 76, 42, 141], j);
            Q = c(Q, P, N, L, I(G, 5), t, [66, 57, 250, 255], g);
            L = c(L, Q, P, N, I(G, 8), s, [129, 246, 113, 135], g);
            N = c(N, L, Q, P, I(G, 11), r, [34, 97, 157, 109], g);
            P = c(P, N, L, Q, I(G, 14), q, [12, 56, 229, 253], g);
            Q = c(Q, P, N, L, I(G, 1), t, [68, 234, 190, 164], g);
            L = c(L, Q, P, N, I(G, 4), s, [169, 207, 222, 75], g);
            N = c(N, L, Q, P, I(G, 7), r, [96, 75, 187, 246], g);
            P = c(P, N, L, Q, I(G, 10), q, [112, 188, 191, 190], g);
            Q = c(Q, P, N, L, I(G, 13), t, [198, 126, 155, 40], g);
            L = c(L, Q, P, N, I(G, 0), s, [250, 39, 161, 234], g);
            N = c(N, L, Q, P, I(G, 3), r, [133, 48, 239, 212], g);
            P = c(P, N, L, Q, I(G, 6), q, [5, 29, 136, 4], g);
            Q = c(Q, P, N, L, I(G, 9), t, [57, 208, 212, 217], g);
            L = c(L, Q, P, N, I(G, 12), s, [229, 153, 219, 230], g);
            N = c(N, L, Q, P, I(G, 15), r, [248, 124, 162, 31], g);
            P = c(P, N, L, Q, I(G, 2), q, [101, 86, 172, 196], g);
            Q = c(Q, P, N, L, I(G, 0), C, [68, 34, 41, 244], f);
            L = c(L, Q, P, N, I(G, 7), A, [151, 255, 42, 67], f);
            N = c(N, L, Q, P, I(G, 14), y, [167, 35, 148, 171], f);
            P = c(P, N, L, Q, I(G, 5), w, [57, 160, 147, 252], f);
            Q = c(Q, P, N, L, I(G, 12), C, [195, 89, 91, 101], f);
            L = c(L, Q, P, N, I(G, 3), A, [146, 204, 12, 143], f);
            N = c(N, L, Q, P, I(G, 10), y, [125, 244, 239, 255], f);
            P = c(P, N, L, Q, I(G, 1), w, [209, 93, 132, 133], f);
            Q = c(Q, P, N, L, I(G, 8), C, [79, 126, 168, 111], f);
            L = c(L, Q, P, N, I(G, 15), A, [224, 230, 44, 254], f);
            N = c(N, L, Q, P, I(G, 6), y, [20, 67, 1, 163], f);
            P = c(P, N, L, Q, I(G, 13), w, [161, 17, 8, 78], f);
            Q = c(Q, P, N, L, I(G, 4), C, [130, 126, 83, 247], f);
            L = c(L, Q, P, N, I(G, 11), A, [53, 242, 58, 189], f);
            N = c(N, L, Q, P, I(G, 2), y, [187, 210, 215, 42], f);
            P = c(P, N, L, Q, I(G, 9), w, [145, 211, 134, 235], f);
            Q = n(Q, F);
            P = n(P, p);
            N = n(N, u);
            L = n(L, E)
        }
        return a(Q, P, N, L)
    };
    m.fromUTF8 = function (p) {
        return i(d(p))
    };
    m.fromHex = function (p) {
        return i(h(p))
    };
    m.fromBase64 = function (p) {
        return i(o(p))
    };
    return m
};