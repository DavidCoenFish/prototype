﻿using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class TestSuite
{
    // A Test behaves as an ordinary method
    [Test]
    public void SpringTestSimplePasses()
    {
        // Use the Assert class to test conditions
        var spring = new Spring(1.0f, 0.0f, 0.1f);
        for (int index = 0; index < 1000; ++index)
        {
            spring.Advance(1.0f, 0.02f);
        }
        var result = spring.Advance(1.0f, 0.02f);
        Assert.IsTrue( UnityEngine.Mathf.Abs(result - 1.0f) < 0.01f );
    }

    //// A UnityTest behaves like a coroutine in Play Mode. In Edit Mode you can use
    //// `yield return null;` to skip a frame.
    //[UnityTest]
    //public IEnumerator SpringTestWithEnumeratorPasses()
    //{
    //    // Use the Assert class to test conditions.
    //    // Use yield to skip a frame.
    //    yield return null;
    //}
}
