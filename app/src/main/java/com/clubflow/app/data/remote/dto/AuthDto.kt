package com.clubflow.app.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AuthUserDto(
    val id: String,
    val email: String,
    @SerialName("fullName") val fullName: String,
)

@Serializable
data class AuthResponseDto(
    val token: String,
    val user: AuthUserDto,
)

@Serializable
data class AuthRequestDto(
    val email: String,
    val password: String,
)

@Serializable
data class RegisterRequestDto(
    @SerialName("fullName") val fullName: String,
    val phone: String? = null,
    val email: String,
    val password: String,
)

@Serializable
data class ErrorEnvelopeDto(
    val error: ErrorDto,
)

@Serializable
data class ErrorDto(
    val code: String,
    val message: String,
)
