package com.steptracker

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.*
import android.view.Gravity
import android.widget.ProgressBar
import androidx.annotation.NonNull
import androidx.core.content.res.ResourcesCompat
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class ProgressBarViewManager : SimpleViewManager<ProgressBar>() {
    companion object {
        const val REACT_CLASS = "ProgressBarView"
        private const val PROGRESS_BAR_HEIGHT_DP = 8
        private const val CORNER_RADIUS_DP = 4
    }

    @NonNull
    override fun getName() = REACT_CLASS

    @NonNull
    override fun createViewInstance(@NonNull reactContext: ThemedReactContext): ProgressBar {
        return ProgressBar(reactContext, null, android.R.attr.progressBarStyleHorizontal).apply {
            progressDrawable = createProgressDrawable(reactContext).mutate()
            minimumHeight = PROGRESS_BAR_HEIGHT_DP.dpToPx(reactContext)
            max = 100
        }
    }

    private fun createProgressDrawable(context: Context): LayerDrawable {
        val background = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = CORNER_RADIUS_DP.dpToPx(context).toFloat()
            setColor(Color.WHITE)
        }

        val progress = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = CORNER_RADIUS_DP.dpToPx(context).toFloat()
            setColor(Color.BLUE)
        }

        val clipProgress = ClipDrawable(
            progress,
            Gravity.START,
            ClipDrawable.HORIZONTAL
        )

        return LayerDrawable(arrayOf(background, clipProgress)).apply {
            setId(0, android.R.id.background)
            setId(1, android.R.id.progress)
        }
    }

    @ReactProp(name = "progress")
    fun setProgress(view: ProgressBar, progress: Float) {
        val clampedProgress = progress.coerceIn(0f, 1f)
        view.progress = (clampedProgress * 100).toInt()
    }

    @ReactProp(name = "progressColor")
    fun setProgressColor(view: ProgressBar, color: String?) {
        val colorToApply = try {
            color?.let { Color.parseColor(it) } ?: Color.BLUE
        } catch (e: IllegalArgumentException) {
            Color.BLUE
        }

        (view.progressDrawable as? LayerDrawable)?.apply {
            (getDrawable(1) as? ClipDrawable)?.drawable?.let {
                (it as? GradientDrawable)?.setColor(colorToApply)
            }
        }
    }

    private fun Int.dpToPx(context: Context): Int =
        (this * context.resources.displayMetrics.density).toInt()
}