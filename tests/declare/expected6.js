define([
    "dojo/_base/declare"
], function (
    declare
) {
    return declare('SOME.lie.of.a.Module', [ParentOne, ParentTwo,
        ParentThree], 
    {
        fake: 'test'
    });
});