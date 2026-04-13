package com.clubflow.app.data.remote

import com.clubflow.app.data.remote.dto.AuthRequestDto
import com.clubflow.app.data.remote.dto.AuthResponseDto
import com.clubflow.app.data.remote.dto.ErrorEnvelopeDto
import com.clubflow.app.data.remote.dto.RegisterRequestDto
import com.clubflow.app.data.remote.dto.TrainingDto
import com.clubflow.app.data.remote.dto.TrainingsEnvelopeDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class KtorClubFlowApi @Inject constructor(
    private val httpClient: HttpClient,
    private val baseUrl: String,
) : ClubFlowApi {
    override suspend fun login(email: String, password: String): AuthResponseDto {
        return try {
            httpClient.post {
                url(baseUrl + "api/v1/customer/auth/login")
                setBody(AuthRequestDto(email = email, password = password))
            }.body()
        } catch (error: ClientRequestException) {
            throw IllegalStateException(error.response.body<ErrorEnvelopeDto>().error.message)
        }
    }

    override suspend fun register(fullName: String, phone: String, email: String, password: String): AuthResponseDto {
        return try {
            httpClient.post {
                url(baseUrl + "api/v1/customer/auth/register")
                setBody(RegisterRequestDto(fullName = fullName, phone = phone.ifBlank { null }, email = email, password = password))
            }.body()
        } catch (error: ClientRequestException) {
            throw IllegalStateException(error.response.body<ErrorEnvelopeDto>().error.message)
        }
    }

    override suspend fun fetchUpcomingTrainings(token: String): List<TrainingDto> {
        return try {
            httpClient.get {
                url(baseUrl + "api/v1/customer/trainings/upcoming")
                header("Authorization", "Bearer $token")
            }.body<TrainingsEnvelopeDto>().items
        } catch (error: ClientRequestException) {
            throw IllegalStateException(error.response.body<ErrorEnvelopeDto>().error.message)
        }
    }

    override suspend fun bookTraining(token: String, trainingId: String): TrainingDto {
        return try {
            httpClient.post {
                url(baseUrl + "api/v1/customer/trainings/$trainingId/book")
                header("Authorization", "Bearer $token")
            }.body()
        } catch (error: ClientRequestException) {
            throw IllegalStateException(error.response.body<ErrorEnvelopeDto>().error.message)
        }
    }

    override suspend fun cancelBooking(token: String, trainingId: String): TrainingDto {
        return try {
            httpClient.post {
                url(baseUrl + "api/v1/customer/trainings/$trainingId/cancel")
                header("Authorization", "Bearer $token")
            }.body()
        } catch (error: ClientRequestException) {
            throw IllegalStateException(error.response.body<ErrorEnvelopeDto>().error.message)
        }
    }
}
