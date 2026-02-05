import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByUsername, hashPassword } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'dob',
      'ssn',
      'email',
      'phone',
      'addressLine1',
      'city',
      'state',
      'zipCode',
      'username',
      'password',
      'netWorth',
      'householdIncome',
      'maritalStatus',
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    if (!data.email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate SSN format (9 digits)
    const ssnDigits = data.ssn.replace(/[^0-9]/g, '')
    if (ssnDigits.length !== 9) {
      return NextResponse.json(
        { error: 'SSN must be 9 digits' },
        { status: 400 }
      )
    }

    // Validate password length
    if (data.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUser = findUserByUsername(data.username)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    // Check if email already exists
    const existingEmail = findUserByUsername(data.email)
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = hashPassword(data.password)

    // Create user
    const user = createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      // In a real app, we'd store all the KYC data
      // For now, we're just storing the essentials
    })

    // In production, you would:
    // 1. Store encrypted SSN
    // 2. Send verification email
    // 3. Create audit log entry
    // 4. Trigger compliance checks

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId: user.id,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
