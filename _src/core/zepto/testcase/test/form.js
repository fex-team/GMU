// test to see if we augment Array.prototype.reduceif not supported natively
test("prepare", function(){
    var html = '<h1>Zepto form tests</h1><p id="results">Running… see browser console for results<p><div id="fixtures"><form id="login_form" target="formtarget" action="./idontexist.html"><input name="email" value="koss@nocorp.me"><input name="password" value="123456"><input name="unchecked_hasValue" value="myValue" type="checkbox"><input name="unchecked_noValue" type="checkbox"><input name="checked_hasValue" checked value="myValue" type="checkbox"><input name="checked_disabled" checked value="ImDisabled" type="checkbox" disabled><input name="checked_noValue" checked type="checkbox"><fieldset><input type="radio" name="radio1" value="r1"><input type="radio" name="radio1" checked value="r2"><input type="radio" name="radio1" value="r3"></fieldset><select name="selectbox"><option value="selectopt1">select1</option><option value="selectopt2">select2</option><option value="selectopt3">select3</option></select><div class="actions"><input type="submit" name="submit" value="Save"><input type="button" name="preview" value="Preview"><input type="reset" name="clear" value="Clear form"><button name="button">Im a button</button></div></form><iframe name="formtarget"></iframe></div>'
    $("body").append(html);
    ok($("#fixtures"));
})

test("testSerializeArray", function (t) {
    var loginForm = $('#login_form')

    assertEqual(Function, loginForm.serializeArray.constructor)
    assertEqual(6, loginForm.serializeArray().length);
    assertEqualObject(
        [
            { name: 'email', value: 'koss@nocorp.me' },
            { name: 'password', value: '123456' },
            { name: 'checked_hasValue', value: 'myValue' },
            { name: 'checked_noValue', value: 'on' },
            { name: 'radio1', value: 'r2' },
            { name: 'selectbox', value: 'selectopt1' }

        ],
        loginForm.serializeArray()
    ) //TODO ERROR both
})

test("testSerialize", function (t) {
    var loginForm = $('#login_form')

    assertEqual(Function, loginForm.serialize.constructor)
    assertEqual( 'string', typeof loginForm.serialize() )

    assertEqual( 'email=koss%40nocorp.me&password=123456&checked_hasValue=myValue&checked_noValue=on&radio1=r2&selectbox=selectopt1', loginForm.serialize() )
})

test("testFormSubmit", function (t) {
    var eventTriggered = false
    $('#login_form').submit(function (e) {
        eventTriggered = true
        e.preventDefault()
    })
    $('#login_form').submit()
    ok(eventTriggered) ////TODO ERROR ie
})