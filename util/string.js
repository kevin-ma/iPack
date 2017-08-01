/**
 * Created by kevin on 2017/7/31.
 */

String.prototype.upperCaseFirst = function firstUpperCase() {
    return this.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};
