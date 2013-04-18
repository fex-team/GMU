test("testTrim", function(t){
        assertEqual("blah", " blah ".trim())
    })

    // test to see if we augment Array.prototype.reduceif not supported natively
    test("testReduce", function(t){
        assertEqual(
            10,
            [0,1,2,3,4].reduce(function(p,c){ return p+c })
        )

        assertEqual(
            20,
            [0,1,2,3,4].reduce(function(p,c){ return p+c }, 10)
        )

        var flattened = [[0,1], [2,3], [4,5]].reduce(function(a,b){
            return a.concat(b)
        })

        assertEqual(6, flattened.length)

        for(var i=0;i<6;i++) assertEqual(i, flattened[i])
    })