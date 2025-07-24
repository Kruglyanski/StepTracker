package com.steptracker

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import android.util.Log

@ReactModule(name = NativeStepCounterModule.NAME)
class NativeStepCounterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), TurboModule, SensorEventListener {

    companion object {
        const val NAME = "NativeStepCounter"
    }

    private var sensorManager: SensorManager? = null
    private var stepSensor: Sensor? = null
    private var stepCount = 0
    private var initialStepCount = -1

    override fun initialize() {
        sensorManager = reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        stepSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
    }

    @ReactMethod
    fun startStepCounting() {
        if (sensorManager == null || stepSensor == null) {
            this.initialize()
        }

        if (stepSensor == null) {
            Log.e(NAME, "Step counter sensor not available!")
            return
        }

        reactApplicationContext.runOnUiQueueThread {
            sensorManager?.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_FASTEST)
        }
    }

    @ReactMethod
    fun stopStepCounting() {
        sensorManager?.unregisterListener(this)
    }

    @ReactMethod
    fun getCurrentStepCount(promise: Promise) {
        promise.resolve(stepCount)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            if (it.sensor.type == Sensor.TYPE_STEP_COUNTER) {
                if (initialStepCount < 0) initialStepCount = it.values[0].toInt()
                stepCount = it.values[0].toInt() - initialStepCount
                sendEvent("stepCountChanged", stepCount)
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun sendEvent(eventName: String, data: Any) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    override fun getName() = NAME
}
