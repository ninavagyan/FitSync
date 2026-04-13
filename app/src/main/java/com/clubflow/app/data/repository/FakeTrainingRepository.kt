package com.clubflow.app.data.repository

import com.clubflow.app.domain.model.Training
import com.clubflow.app.domain.model.TrainingCategory
import com.clubflow.app.domain.model.TrainingStatus
import com.clubflow.app.domain.repository.TrainingRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.datetime.plus

class FakeTrainingRepository : TrainingRepository {
    private val trainings = MutableStateFlow(seedTrainings())

    override fun observeUpcomingTrainings(): Flow<List<Training>> = trainings

    override suspend fun refreshTrainings() {
        delay(300)
        trainings.update { current ->
            current.map(::resolveTrainingStatus)
        }
    }

    override suspend fun bookTraining(trainingId: String): Result<Unit> {
        var result: Result<Unit> = Result.failure(IllegalStateException("Training not found"))
        trainings.update { current ->
            current.map { item ->
                if (item.id == trainingId && item.isBookable) {
                    val nextBookedCount = item.bookedCount + 1
                    result = Result.success(Unit)
                    resolveTrainingStatus(
                        item.copy(
                            bookedCount = nextBookedCount,
                            isUserBooked = true,
                        ),
                    )
                } else {
                    if (item.id == trainingId) {
                        result = Result.failure(
                            IllegalStateException("Training is not available for booking."),
                        )
                    }
                    item
                }
            }
        }
        return result
    }

    override suspend fun cancelBooking(trainingId: String): Result<Unit> {
        var result: Result<Unit> = Result.failure(IllegalStateException("Training not found"))
        trainings.update { current ->
            current.map { item ->
                if (item.id == trainingId && item.canCancel) {
                    result = Result.success(Unit)
                    resolveTrainingStatus(
                        item.copy(
                            bookedCount = item.bookedCount - 1,
                            isUserBooked = false,
                        ),
                    )
                } else {
                    if (item.id == trainingId) {
                        result = Result.failure(
                            IllegalStateException("Training booking cannot be cancelled."),
                        )
                    }
                    item
                }
            }
        }
        return result
    }

    private fun resolveTrainingStatus(training: Training, now: Instant = Clock.System.now()): Training {
        val status = when {
            training.status == TrainingStatus.CANCELLED -> TrainingStatus.CANCELLED
            training.endsAt <= now -> TrainingStatus.EXPIRED
            training.bookedCount >= training.capacity -> TrainingStatus.FULL
            else -> TrainingStatus.SCHEDULED
        }
        return training.copy(status = status)
    }

    private fun seedTrainings(): List<Training> {
        val now = Clock.System.now()
        return listOf(
            Training(
                id = "t1",
                name = "Morning Pilates Flow",
                description = "Core-focused pilates session with controlled tempo, stretching, and light reformer-inspired floor work.",
                category = TrainingCategory.PILATES,
                startsAt = now.plus(1, kotlinx.datetime.DateTimeUnit.HOUR),
                endsAt = now.plus(2, kotlinx.datetime.DateTimeUnit.HOUR),
                capacity = 12,
                bookedCount = 7,
                isUserBooked = false,
                instructorName = "Mariam",
                status = TrainingStatus.SCHEDULED,
            ),
            Training(
                id = "t2",
                name = "Sunset Yoga",
                description = "Breath-led yoga flow focused on recovery, hip mobility, and calm evening pacing.",
                category = TrainingCategory.YOGA,
                startsAt = now.plus(5, kotlinx.datetime.DateTimeUnit.HOUR),
                endsAt = now.plus(6, kotlinx.datetime.DateTimeUnit.HOUR),
                capacity = 15,
                bookedCount = 15,
                isUserBooked = true,
                instructorName = "Anna",
                status = TrainingStatus.FULL,
            ),
            Training(
                id = "t3",
                name = "Functional Group Training",
                description = "Small group session combining strength intervals, mobility, and posture-focused conditioning.",
                category = TrainingCategory.GROUP_TRAINING,
                startsAt = now.plus(24, kotlinx.datetime.DateTimeUnit.HOUR),
                endsAt = now.plus(25, kotlinx.datetime.DateTimeUnit.HOUR),
                capacity = 10,
                bookedCount = 4,
                isUserBooked = false,
                instructorName = "David",
                status = TrainingStatus.SCHEDULED,
            ),
            Training(
                id = "t4",
                name = "Lunchtime Express Pilates",
                description = "40-minute quick class for office schedule gaps with focus on posture, balance, and core activation.",
                category = TrainingCategory.PILATES,
                startsAt = now.plus(30, kotlinx.datetime.DateTimeUnit.HOUR),
                endsAt = now.plus(31, kotlinx.datetime.DateTimeUnit.HOUR),
                capacity = 8,
                bookedCount = 2,
                isUserBooked = false,
                instructorName = "Elena",
                status = TrainingStatus.SCHEDULED,
            ),
            Training(
                id = "t5",
                name = "Weekend Restore Yoga",
                description = "Low-intensity weekend recovery class with deep stretch, breath work, and guided cooldown.",
                category = TrainingCategory.YOGA,
                startsAt = now.plus(48, kotlinx.datetime.DateTimeUnit.HOUR),
                endsAt = now.plus(49, kotlinx.datetime.DateTimeUnit.HOUR),
                capacity = 14,
                bookedCount = 9,
                isUserBooked = true,
                instructorName = "Sona",
                status = TrainingStatus.SCHEDULED,
            ),
        ).map(::resolveTrainingStatus)
    }
}
