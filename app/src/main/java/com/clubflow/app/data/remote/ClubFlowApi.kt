package com.clubflow.app.data.remote

import com.clubflow.app.data.remote.dto.AuthResponseDto
import com.clubflow.app.data.remote.dto.TrainingDto

interface ClubFlowApi {
    suspend fun login(email: String, password: String): AuthResponseDto
    suspend fun register(fullName: String, phone: String, email: String, password: String): AuthResponseDto
    suspend fun fetchUpcomingTrainings(token: String): List<TrainingDto>
    suspend fun bookTraining(token: String, trainingId: String): TrainingDto
    suspend fun cancelBooking(token: String, trainingId: String): TrainingDto
}
